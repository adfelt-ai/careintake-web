"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  Building2,
  MapPin,
  Clock,
  Phone,
  Key,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Workflow,
  Bot,
  MessageSquare,
  Settings,
  Sparkles,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddCompanyForm } from "@/components/AddCompanyForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CompanyData extends DocumentData {
  id: string;
  LocationName?: string;
  Timezone?: string;
  AgentPhoneNumber_Retell?: string;
  ApiKey_GHL?: string;
  [key: string]: any;
}

const CompaniesPage = () => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyData | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<CompanyData | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "adfelt_data"));
      
      const documents: CompanyData[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        } as CompanyData);
      });
      setData(documents);
      setError(null);
    } catch (err) {
      console.error("Error fetching documents: ", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCompanyDetails = (company: CompanyData) => {
    setSelectedCompany(company);
    setIsSheetOpen(true);
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, company: CompanyData) => {
    e.stopPropagation();
    setCompanyToDelete(company);
    setDeleteConfirmationText("");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    // Verify the confirmation text matches the LocationName
    if (deleteConfirmationText !== companyToDelete.LocationName) {
      toast.error("Name does not match", {
        description: "Please enter the exact company name to confirm deletion.",
      });
      return;
    }

    try {
      await deleteDoc(doc(db, "adfelt_data", companyToDelete.id));
      toast.success("Company deleted successfully");
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
      setDeleteConfirmationText("");
      fetchData();
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Failed to delete company", {
        description: "Please try again.",
      });
    }
  };

  const handleDeleteDialogClose = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setCompanyToDelete(null);
      setDeleteConfirmationText("");
    }
  };

  const handleEditClick = (e: React.MouseEvent, company: CompanyData) => {
    e.stopPropagation();
    setCompanyToEdit(company);
    setIsEditFormOpen(true);
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.LocationName?.toLowerCase().includes(searchLower) ||
      item.id.toLowerCase().includes(searchLower) ||
      item.AgentPhoneNumber_Retell?.toLowerCase().includes(searchLower) ||
      item.Timezone?.toLowerCase().includes(searchLower)
    );
  });

  const getMainFields = (item: CompanyData) => {
    return {
      LocationName: item.LocationName || "N/A",
      Timezone: item.Timezone || "N/A",
      AgentPhoneNumber: item.AgentPhoneNumber_Retell || "N/A",
      ApiKey: item.ApiKey_GHL ? (item.ApiKey_GHL.length > 20 ? `${item.ApiKey_GHL.substring(0, 20)}...` : item.ApiKey_GHL) : "N/A",
    };
  };

  const getAllFields = (item: CompanyData) => {
    const { id, ...rest } = item;
    return rest;
  };

  const hasApiKey = (item: CompanyData) => {
    return !!(item.ApiKey_GHL && item.ApiKey_GHL.trim() !== "");
  };

  const hasRetellConfig = (item: CompanyData) => {
    return !!(item.Retell_API && item.Retell_API.trim() !== "");
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <Skeleton className="h-11 w-40 hidden md:block" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-l-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-full md:w-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="w-[120px]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="w-[150px]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="w-[200px]">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                      <TableHead className="w-[100px]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-32 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20 rounded-md" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Companies</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = {
    total: filteredData.length,
    withApiKey: filteredData.filter(hasApiKey).length,
    withRetell: filteredData.filter(hasRetellConfig).length,
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Companies</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and view all company configurations and integrations
          </p>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Total Companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {searchTerm ? "matching search" : "in database"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              With GHL API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withApiKey}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.withApiKey / stats.total) * 100) : 0}% configured
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              With Retell AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withRetell}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.withRetell / stats.total) * 100) : 0}% configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Company Directory</CardTitle>
              <CardDescription>
                Click on any row to view detailed configuration
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No companies found" : "No companies available"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Companies will appear here once they are added to the database."}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">Location</TableHead>
                      <TableHead className="w-[120px]">Timezone</TableHead>
                      <TableHead className="w-[150px]">Phone</TableHead>
                      <TableHead className="w-[200px]">API Status</TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => {
                      const mainFields = getMainFields(item);
                      const hasGHL = hasApiKey(item);
                      const hasRetell = hasRetellConfig(item);

                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            "hover:bg-muted/50",
                            index % 2 === 0 && "bg-background"
                          )}
                          onClick={() => openCompanyDetails(item)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {mainFields.LocationName}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {item.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{mainFields.Timezone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono">
                                {mainFields.AgentPhoneNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {hasGHL && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  <Key className="h-3 w-3" />
                                  GHL
                                </span>
                              )}
                              {hasRetell && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                  <Bot className="h-3 w-3" />
                                  Retell
                                </span>
                              )}
                              {!hasGHL && !hasRetell && (
                                <span className="text-xs text-muted-foreground">Not configured</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCompanyDetails(item);
                                }}
                                className="h-8 w-8 p-0"
                                title="View Details"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditClick(e, item)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Edit Company"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteClick(e, item)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Company"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto p-0">
          {selectedCompany && (
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-2xl font-bold mb-2">
                      {selectedCompany.LocationName || "Company Details"}
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs text-muted-foreground">
                      ID: {selectedCompany.id}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-8">
                  {/* Overview Section */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-2 border-b">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCompany.LocationName && (
                        <Card className="border-2 hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-3 pt-4">
                            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                              <MapPin className="h-4 w-4" />
                              Location Name
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-base font-semibold">{selectedCompany.LocationName}</p>
                          </CardContent>
                        </Card>
                      )}
                      {selectedCompany.Timezone && (
                        <Card className="border-2 hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-3 pt-4">
                            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                              <Clock className="h-4 w-4" />
                              Timezone
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-base font-semibold">{selectedCompany.Timezone}</p>
                          </CardContent>
                        </Card>
                      )}
                      {selectedCompany.AgentPhoneNumber_Retell && (
                        <Card className="border-2 hover:border-primary/50 transition-colors md:col-span-2">
                          <CardHeader className="pb-3 pt-4">
                            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                              <Phone className="h-4 w-4" />
                              Agent Phone Number
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between gap-3">
                              <code className="text-sm font-mono bg-muted px-3 py-2 rounded-md flex-1">
                                {selectedCompany.AgentPhoneNumber_Retell}
                              </code>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(selectedCompany.AgentPhoneNumber_Retell || "", `phone-${selectedCompany.id}`)}
                                className="shrink-0"
                              >
                                {copiedField === `phone-${selectedCompany.id}` ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* GoHighLevel Configuration */}
                  {(selectedCompany.ApiKey_GHL || selectedCompany.locationId_GHL) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                          <Key className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold">GoHighLevel Configuration</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        {selectedCompany.ApiKey_GHL && (
                          <Card className="border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10">
                            <CardHeader className="pb-3 pt-4">
                              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                API Key
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-start justify-between gap-3">
                                <code className="flex-1 break-all text-sm font-mono bg-background p-4 rounded-lg border">
                                  {selectedCompany.ApiKey_GHL}
                                </code>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(selectedCompany.ApiKey_GHL || "", `ghl-api-${selectedCompany.id}`)}
                                  className="shrink-0"
                                >
                                  {copiedField === `ghl-api-${selectedCompany.id}` ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'locationId_GHL', label: 'Location ID', icon: MapPin },
                          { key: 'ServiceProviderId_GHL', label: 'Service Provider ID', icon: Building2 },
                          { key: 'PaymentSourceId_GHL', label: 'Payment Source ID', icon: Key },
                          { key: 'PatientNeedingCareId_GHL', label: 'Patient Needing Care ID', icon: Building2 },
                          { key: 'CareNeedsId_GHL', label: 'Care Needs ID', icon: Building2 },
                          { key: 'HoursRequestedId_GHL', label: 'Hours Requested ID', icon: Clock },
                          { key: 'CallDirectionId_GHL', label: 'Call Direction ID', icon: Phone },
                          { key: 'RecentPhoneCallid_GHL', label: 'Recent Phone Call ID', icon: Phone },
                        ].map(({ key, label, icon: Icon }) => {
                          const value = selectedCompany[key];
                          if (!value) return null;
                          return (
                            <Card key={key} className="border-2 hover:border-blue-500/50 transition-colors">
                              <CardHeader className="pb-3 pt-4">
                                <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                                  <Icon className="h-4 w-4" />
                                  {label}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm font-mono break-all bg-muted px-2 py-1.5 rounded flex-1">
                                    {value}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(value, `${key}-${selectedCompany.id}`)}
                                    className="h-8 w-8 p-0 shrink-0"
                                  >
                                    {copiedField === `${key}-${selectedCompany.id}` ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calendars */}
                  {(selectedCompany.FollowUpCalender_GHL || selectedCompany.AssessmentCalender_GHL) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                          <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold">Calendars</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCompany.FollowUpCalender_GHL && (
                          <Card className="border-2 hover:border-green-500/50 transition-colors">
                            <CardHeader className="pb-3 pt-4">
                              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                Follow Up Calendar
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <code className="text-sm font-mono bg-muted px-3 py-2 rounded block">{selectedCompany.FollowUpCalender_GHL}</code>
                            </CardContent>
                          </Card>
                        )}
                        {selectedCompany.AssessmentCalender_GHL && (
                          <Card className="border-2 hover:border-green-500/50 transition-colors">
                            <CardHeader className="pb-3 pt-4">
                              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                Assessment Calendar
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <code className="text-sm font-mono bg-muted px-3 py-2 rounded block">{selectedCompany.AssessmentCalender_GHL}</code>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Workflows */}
                  {(selectedCompany.FollowUpWorkflowId_GHL || selectedCompany.UnqualifiedWorkflow_GHL || selectedCompany.LogCallWorkflowId_GHL) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                          <Workflow className="h-5 w-5 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold">Workflows</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'FollowUpWorkflowId_GHL', label: 'Follow Up Workflow' },
                          { key: 'UnqualifiedWorkflow_GHL', label: 'Unqualified Workflow' },
                          { key: 'LogCallWorkflowId_GHL', label: 'Log Call Workflow' },
                        ].map(({ key, label }) => {
                          const value = selectedCompany[key];
                          if (!value) return null;
                          return (
                            <Card key={key} className="border-2 hover:border-orange-500/50 transition-colors">
                              <CardHeader className="pb-3 pt-4">
                                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                  {label}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <code className="text-sm font-mono break-all bg-muted px-3 py-2 rounded block">{value}</code>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Retell AI Configuration */}
                  {(selectedCompany.Retell_API || selectedCompany.IntakeSpecialistAgentId_Retell) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                          <Bot className="h-5 w-5 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold">Retell AI Configuration</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        {selectedCompany.Retell_API && (
                          <Card className="border-2 border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/10">
                            <CardHeader className="pb-3 pt-4">
                              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                Retell API Key
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-start justify-between gap-3">
                                <code className="flex-1 break-all text-sm font-mono bg-background p-4 rounded-lg border">
                                  {selectedCompany.Retell_API}
                                </code>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(selectedCompany.Retell_API || "", `retell-api-${selectedCompany.id}`)}
                                  className="shrink-0"
                                >
                                  {copiedField === `retell-api-${selectedCompany.id}` ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'IntakeSpecialistAgentId_Retell', label: 'Intake Specialist Agent' },
                            { key: 'FollowUpAgentId_Retell', label: 'Follow Up Agent' },
                            { key: 'ApptManagerAgentId_Retell', label: 'Appointment Manager Agent' },
                          ].map(({ key, label }) => {
                            const value = selectedCompany[key];
                            if (!value) return null;
                            return (
                              <Card key={key} className="border-2 hover:border-purple-500/50 transition-colors">
                                <CardHeader className="pb-3 pt-4">
                                  <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                    {label}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <code className="text-sm font-mono break-all bg-muted px-3 py-2 rounded block">{value}</code>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Discord Configuration */}
                  {(selectedCompany.Discord_Bot_Token || selectedCompany.Discord_Channel_ID_AI_Calls) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                          <MessageSquare className="h-5 w-5 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold">Discord Configuration</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        {selectedCompany.Discord_Bot_Token && (
                          <Card className="border-2 border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/10">
                            <CardHeader className="pb-3 pt-4">
                              <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                Discord Bot Token
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-start justify-between gap-3">
                                <code className="flex-1 break-all text-sm font-mono bg-background p-4 rounded-lg border">
                                  {selectedCompany.Discord_Bot_Token}
                                </code>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(selectedCompany.Discord_Bot_Token || "", `discord-token-${selectedCompany.id}`)}
                                  className="shrink-0"
                                >
                                  {copiedField === `discord-token-${selectedCompany.id}` ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'Discord_Channel_ID_AI_Calls', label: 'AI Calls Channel ID' },
                            { key: 'Discord_Channel_ID_Automation_Errors', label: 'Automation Errors Channel ID' },
                          ].map(({ key, label }) => {
                            const value = selectedCompany[key];
                            if (!value) return null;
                            return (
                              <Card key={key} className="border-2 hover:border-indigo-500/50 transition-colors">
                                <CardHeader className="pb-3 pt-4">
                                  <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                    {label}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <code className="text-sm font-mono break-all bg-muted px-3 py-2 rounded block">{value}</code>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Fields */}
                  {(() => {
                    const allFields = getAllFields(selectedCompany);
                    const displayedFields = [
                      'LocationName', 'Timezone', 'AgentPhoneNumber_Retell', 'ApiKey_GHL',
                      'locationId_GHL', 'ServiceProviderId_GHL', 'PaymentSourceId_GHL',
                      'PatientNeedingCareId_GHL', 'CareNeedsId_GHL', 'HoursRequestedId_GHL',
                      'CallDirectionId_GHL', 'RecentPhoneCallid_GHL', 'FollowUpCalender_GHL',
                      'AssessmentCalender_GHL', 'FollowUpWorkflowId_GHL', 'UnqualifiedWorkflow_GHL',
                      'LogCallWorkflowId_GHL', 'Retell_API', 'IntakeSpecialistAgentId_Retell',
                      'FollowUpAgentId_Retell', 'ApptManagerAgentId_Retell', 'Discord_Bot_Token',
                      'Discord_Channel_ID_AI_Calls', 'Discord_Channel_ID_Automation_Errors'
                    ];
                    const otherFields = Object.entries(allFields).filter(
                      ([key]) => !displayedFields.includes(key) && allFields[key] !== null && allFields[key] !== undefined && allFields[key] !== ""
                    );

                    if (otherFields.length === 0) return null;

                    return (
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 pb-2 border-b">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-bold">Additional Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {otherFields.map(([key, value]) => (
                            <Card key={key} className="border-2 hover:border-primary/50 transition-colors">
                              <CardHeader className="pb-3 pt-4">
                                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                                  {key.replace(/_/g, " ")}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm font-mono break-all bg-muted px-3 py-2 rounded flex-1">
                                    {String(value)}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(String(value), `other-${key}-${selectedCompany.id}`)}
                                    className="h-8 w-8 p-0 shrink-0"
                                  >
                                    {copiedField === `other-${key}-${selectedCompany.id}` ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Company Form */}
      <AddCompanyForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={fetchData}
      />

      {/* Edit Company Form */}
      {companyToEdit && (
        <AddCompanyForm
          open={isEditFormOpen}
          onOpenChange={(open) => {
            setIsEditFormOpen(open);
            if (!open) {
              setCompanyToEdit(null);
            }
          }}
          onSuccess={() => {
            fetchData();
            setCompanyToEdit(null);
          }}
          companyData={companyToEdit}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <span>
                This action cannot be undone. This will permanently delete the company{" "}
                <span className="font-semibold text-foreground">
                  {companyToDelete?.LocationName || companyToDelete?.id}
                </span>{" "}
                and all of its data from the database.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="delete-confirmation" className="text-sm font-medium">
                To confirm, please type the company name:{" "}
                <span className="font-semibold text-foreground">
                  {companyToDelete?.LocationName || companyToDelete?.id}
                </span>
              </label>
              <Input
                id="delete-confirmation"
                placeholder="Enter company name"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="mt-2"
                autoFocus
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" onClick={() => handleDeleteDialogClose(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmationText !== companyToDelete?.LocationName}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesPage;
