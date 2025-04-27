
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { initiateCall, CallRequest } from "@/services/phone-call";
import { CallInfo } from "@/services/phone-call";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const countryCodes = [
  { label: "United States", code: "+1" },
  { label: "United Kingdom", code: "+44" },
  { label: "Canada", code: "+1" },
  { label: "Germany", code: "+49" },
  { label: "France", code: "+33" },
  { label: "Japan", code: "+81" },
  { label: "India", code: "+91" },
  { label: "China", code: "+86" },
  { label: "Brazil", code: "+55" },
  { label: "Australia", code: "+61" },
];

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCall = async () => {
    setIsLoading(true);
    try {
      const callRequest: CallRequest = {
        phoneNumber: phoneNumber,
        countryCode: countryCode,
      };
      const callData = await initiateCall(callRequest);
      setCallInfo(callData);
      toast({
        title: "Call initiated",
        description: `Call duration: ${callData.duration} seconds, Cost: $${callData.cost}`,
      });
    } catch (error: any) {
      console.error("Call initiation failed:", error);
      toast({
        variant: "destructive",
        title: "Error initiating call",
        description: error.message || "Failed to initiate call. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-secondary">
      <Card className="w-full max-w-md space-y-4 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Global Connect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={`${country.code}-${country.label}`} value={country.code}>
                    {country.label} ({country.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button
            onClick={handleCall}
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? "Calling..." : "Call"}
          </Button>
        </CardContent>
      </Card>
      {callInfo && (
        <Card className="w-full max-w-md mt-4 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Call Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="my-2" />
            <p>Duration: {callInfo.duration} seconds</p>
            <p>Cost: ${callInfo.cost}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
