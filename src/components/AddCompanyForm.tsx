"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Building2,
  Key,
  Calendar,
  Workflow,
  Bot,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface AddCompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  companyData?: any;
  mode?: "add" | "edit";
}

interface FormData {
  // Basic Information
  LocationName: string;
  Timezone: string;
  AgentPhoneNumber_Retell: string;

  // GoHighLevel Configuration
  ApiKey_GHL: string;
  locationId_GHL: string;
  ServiceProviderId_GHL: string;
  PaymentSourceId_GHL: string;
  PatientNeedingCareId_GHL: string;
  CareNeedsId_GHL: string;
  HoursRequestedId_GHL: string;
  CallDirectionId_GHL: string;
  RecentPhoneCallid_GHL: string;

  // Calendars
  FollowUpCalender_GHL: string;
  AssessmentCalender_GHL: string;

  // Workflows
  FollowUpWorkflowId_GHL: string;
  UnqualifiedWorkflow_GHL: string;
  LogCallWorkflowId_GHL: string;

  // Retell AI
  Retell_API: string;
  IntakeSpecialistAgentId_Retell: string;
  FollowUpAgentId_Retell: string;
  ApptManagerAgentId_Retell: string;

  // Discord
  Discord_Bot_Token: string;
  Discord_Channel_ID_AI_Calls: string;
  Discord_Channel_ID_Automation_Errors: string;
}

const steps = [
  "Basic Info",
  "GoHighLevel",
  "Calendars & Workflows",
  "Retell AI",
  "Discord",
];

export function AddCompanyForm({ open, onOpenChange, onSuccess, companyData, mode = "add" }: AddCompanyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<FormData>>({});

  // Pre-fill form data when editing
  useEffect(() => {
    if (mode === "edit" && companyData && open) {
      const { id, ...rest } = companyData;
      setFormData(rest as Partial<FormData>);
      setCurrentStep(1);
    } else if (mode === "add" && open) {
      setFormData({});
      setCurrentStep(1);
    }
  }, [companyData, mode, open]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && companyData?.id) {
        // Update: only set updated_at, keep created_at from original
        const updateData = {
          ...formData,
          updated_at: serverTimestamp(),
        };
        await updateDoc(doc(db, "adfelt_data", companyData.id), updateData);
        toast.success("Company updated successfully");
      } else {
        // Create: set both created_at and updated_at
        const createData = {
          ...formData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        await addDoc(collection(db, "adfelt_data"), createData);
        toast.success("Company added successfully");
      }
      setFormData({});
      setCurrentStep(1);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "adding"} document: `, error);
      toast.error(`Failed to ${mode === "edit" ? "update" : "add"} company`, {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="LocationName" className="text-base font-semibold">
                Location Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="LocationName"
                placeholder="e.g., Dynamic-n8n"
                value={formData.LocationName || ""}
                onChange={(e) => updateFormData("LocationName", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="Timezone" className="text-base font-semibold">
                Timezone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="Timezone"
                placeholder="e.g., US/Pacific"
                value={formData.Timezone || ""}
                onChange={(e) => updateFormData("Timezone", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="AgentPhoneNumber_Retell" className="text-base font-semibold">
                Agent Phone Number (Retell)
              </Label>
              <Input
                id="AgentPhoneNumber_Retell"
                placeholder="e.g., +1(725)765-3537"
                value={formData.AgentPhoneNumber_Retell || ""}
                onChange={(e) => updateFormData("AgentPhoneNumber_Retell", e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="ApiKey_GHL" className="text-base font-semibold">
                GoHighLevel API Key
              </Label>
              <Input
                id="ApiKey_GHL"
                placeholder="e.g., pit-a1f69519-b921-4961-94b3-9b07ac9872b5"
                value={formData.ApiKey_GHL || ""}
                onChange={(e) => updateFormData("ApiKey_GHL", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label htmlFor="locationId_GHL">Location ID</Label>
                <Input
                  id="locationId_GHL"
                  placeholder="Location ID"
                  value={formData.locationId_GHL || ""}
                  onChange={(e) => updateFormData("locationId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="ServiceProviderId_GHL">Service Provider ID</Label>
                <Input
                  id="ServiceProviderId_GHL"
                  placeholder="Service Provider ID"
                  value={formData.ServiceProviderId_GHL || ""}
                  onChange={(e) => updateFormData("ServiceProviderId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="PaymentSourceId_GHL">Payment Source ID</Label>
                <Input
                  id="PaymentSourceId_GHL"
                  placeholder="Payment Source ID"
                  value={formData.PaymentSourceId_GHL || ""}
                  onChange={(e) => updateFormData("PaymentSourceId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="PatientNeedingCareId_GHL">Patient Needing Care ID</Label>
                <Input
                  id="PatientNeedingCareId_GHL"
                  placeholder="Patient Needing Care ID"
                  value={formData.PatientNeedingCareId_GHL || ""}
                  onChange={(e) => updateFormData("PatientNeedingCareId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="CareNeedsId_GHL">Care Needs ID</Label>
                <Input
                  id="CareNeedsId_GHL"
                  placeholder="Care Needs ID"
                  value={formData.CareNeedsId_GHL || ""}
                  onChange={(e) => updateFormData("CareNeedsId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="HoursRequestedId_GHL">Hours Requested ID</Label>
                <Input
                  id="HoursRequestedId_GHL"
                  placeholder="Hours Requested ID"
                  value={formData.HoursRequestedId_GHL || ""}
                  onChange={(e) => updateFormData("HoursRequestedId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="CallDirectionId_GHL">Call Direction ID</Label>
                <Input
                  id="CallDirectionId_GHL"
                  placeholder="Call Direction ID"
                  value={formData.CallDirectionId_GHL || ""}
                  onChange={(e) => updateFormData("CallDirectionId_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="RecentPhoneCallid_GHL">Recent Phone Call ID</Label>
                <Input
                  id="RecentPhoneCallid_GHL"
                  placeholder="Recent Phone Call ID"
                  value={formData.RecentPhoneCallid_GHL || ""}
                  onChange={(e) => updateFormData("RecentPhoneCallid_GHL", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Calendars
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="FollowUpCalender_GHL">Follow Up Calendar</Label>
                  <Input
                    id="FollowUpCalender_GHL"
                    placeholder="Follow Up Calendar ID"
                    value={formData.FollowUpCalender_GHL || ""}
                    onChange={(e) => updateFormData("FollowUpCalender_GHL", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="AssessmentCalender_GHL">Assessment Calendar</Label>
                  <Input
                    id="AssessmentCalender_GHL"
                    placeholder="Assessment Calendar ID"
                    value={formData.AssessmentCalender_GHL || ""}
                    onChange={(e) => updateFormData("AssessmentCalender_GHL", e.target.value)}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="h-5 w-5 text-orange-500" />
                  Workflows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="FollowUpWorkflowId_GHL">Follow Up Workflow ID</Label>
                  <Input
                    id="FollowUpWorkflowId_GHL"
                    placeholder="Follow Up Workflow ID"
                    value={formData.FollowUpWorkflowId_GHL || ""}
                    onChange={(e) => updateFormData("FollowUpWorkflowId_GHL", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="UnqualifiedWorkflow_GHL">Unqualified Workflow ID</Label>
                  <Input
                    id="UnqualifiedWorkflow_GHL"
                    placeholder="Unqualified Workflow ID"
                    value={formData.UnqualifiedWorkflow_GHL || ""}
                    onChange={(e) => updateFormData("UnqualifiedWorkflow_GHL", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="LogCallWorkflowId_GHL">Log Call Workflow ID</Label>
                  <Input
                    id="LogCallWorkflowId_GHL"
                    placeholder="Log Call Workflow ID"
                    value={formData.LogCallWorkflowId_GHL || ""}
                    onChange={(e) => updateFormData("LogCallWorkflowId_GHL", e.target.value)}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="Retell_API" className="text-base font-semibold">
                Retell API Key
              </Label>
              <Input
                id="Retell_API"
                placeholder="e.g., Bearer key_aba38935888f78bef0384b9f5012"
                value={formData.Retell_API || ""}
                onChange={(e) => updateFormData("Retell_API", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label htmlFor="IntakeSpecialistAgentId_Retell">Intake Specialist Agent ID</Label>
                <Input
                  id="IntakeSpecialistAgentId_Retell"
                  placeholder="Agent ID"
                  value={formData.IntakeSpecialistAgentId_Retell || ""}
                  onChange={(e) => updateFormData("IntakeSpecialistAgentId_Retell", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="FollowUpAgentId_Retell">Follow Up Agent ID</Label>
                <Input
                  id="FollowUpAgentId_Retell"
                  placeholder="Agent ID"
                  value={formData.FollowUpAgentId_Retell || ""}
                  onChange={(e) => updateFormData("FollowUpAgentId_Retell", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="ApptManagerAgentId_Retell">Appointment Manager Agent ID</Label>
                <Input
                  id="ApptManagerAgentId_Retell"
                  placeholder="Agent ID"
                  value={formData.ApptManagerAgentId_Retell || ""}
                  onChange={(e) => updateFormData("ApptManagerAgentId_Retell", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="Discord_Bot_Token" className="text-base font-semibold">
                Discord Bot Token
              </Label>
              <Input
                id="Discord_Bot_Token"
                placeholder="e.g., Bot MTQxNDYzODA5MTEwNDE2MTg5Mw..."
                value={formData.Discord_Bot_Token || ""}
                onChange={(e) => updateFormData("Discord_Bot_Token", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label htmlFor="Discord_Channel_ID_AI_Calls">AI Calls Channel ID</Label>
                <Input
                  id="Discord_Channel_ID_AI_Calls"
                  placeholder="Channel ID"
                  value={formData.Discord_Channel_ID_AI_Calls || ""}
                  onChange={(e) => updateFormData("Discord_Channel_ID_AI_Calls", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="Discord_Channel_ID_Automation_Errors">Automation Errors Channel ID</Label>
                <Input
                  id="Discord_Channel_ID_Automation_Errors"
                  placeholder="Channel ID"
                  value={formData.Discord_Channel_ID_Automation_Errors || ""}
                  onChange={(e) => updateFormData("Discord_Channel_ID_Automation_Errors", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Building2 className="h-5 w-5" />;
      case 2:
        return <Key className="h-5 w-5" />;
      case 3:
        return <Calendar className="h-5 w-5" />;
      case 4:
        return <Bot className="h-5 w-5" />;
      case 5:
        return <MessageSquare className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setFormData({});
    setCurrentStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Fixed Header and Stepper */}
        <div className="flex-shrink-0 border-b bg-background">
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {mode === "edit" ? "Edit Company" : "Add New Company"}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    {mode === "edit" 
                      ? "Update the company details step by step"
                      : "Fill in the company details step by step"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="px-6 pb-4">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderStepContent()}
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="gap-2" size="lg">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.LocationName || !formData.Timezone}
                  className="gap-2"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "edit" ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      {mode === "edit" ? "Update Company" : "Add Company"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
