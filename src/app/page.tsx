'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {CallInfo, initiateCall} from '@/services/phone-call';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {Phone, Contact, Clock} from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent as TabContent,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ScrollArea} from '@/components/ui/scroll-area';

const countryCodes = [
  {label: 'United States', code: '+1'},
  {label: 'United Kingdom', code: '+44'},
  {label: 'Germany', code: '+49'},
  {label: 'India', code: '+91'},
  {label: 'China', code: '+86'},
  {label: 'Japan', code: '+81'},
];

const dummyRecentCalls = [
  {id: '1', number: '+15551234567', duration: 60, cost: 0.06},
  {id: '2', number: '+442079460000', duration: 120, cost: 0.12},
  {id: '3', number: '+493090197000', duration: 180, cost: 0.18},
  {id: '4', number: '+15551234567', duration: 60, cost: 0.06},
  {id: '5', number: '+442079460000', duration: 120, cost: 0.12},
  {id: '6', number: '+493090197000', duration: 180, cost: 0.18},
  {id: '7', number: '+15551234567', duration: 60, cost: 0.06},
  {id: '8', number: '+442079460000', duration: 120, cost: 0.12},
  {id: '9', number: '+493090197000', duration: 180, cost: 0.18},
  {id: '10', number: '+15551234567', duration: 60, cost: 0.06},
  {id: '11', number: '+442079460000', duration: 120, cost: 0.12},
  {id: '12', number: '+493090197000', duration: 180, cost: 0.18},
];

const dummyContacts = [
  {id: '1', name: 'John Doe', number: '+15555555555'},
  {id: '2', name: 'Jane Smith', number: '+447700900000'},
  {id: '3', name: 'Peter Jones', number: '+4915162900000'},
  {id: '4', name: 'Alice Johnson', number: '+15551112222'},
  {id: '5', name: 'Bob Williams', number: '+447700333444'},
  {id: '6', name: 'Charlie Brown', number: '+4915162955555'},
  {id: '7', name: 'Diana Miller', number: '+15559998888'},
  {id: '8', name: 'Ethan Davis', number: '+447700777666'},
  {id: '9', name: 'Fiona Green', number: '+4915162911111'},
  {id: '10', name: 'Grace Taylor', number: '+15551230000'},
  {id: '11', name: 'Henry Wilson', number: '+447700456789'},
  {id: '12', name: 'Ivy Moore', number: '+4915162922222'},
];

const Keypad = ({
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  isLoading,
  handleCall,
}: {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  isLoading: boolean;
  handleCall: () => Promise<void>;
}) => {
  const handleNumberInput = (number: string) => {
    setPhoneNumber((prevNumber: string) => prevNumber + number);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select country code" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.label} ({country.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          className="flex-1 w-full p-3 border rounded sm:w-full md:w-3/4"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '*',
          '0',
          '#',
        ].map(number => (
          <Button
            key={number}
            variant="secondary"
            className="rounded-full p-6 text-2xl"
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleCall}
        disabled={isLoading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full border-4 border-t-transparent border-gray-200 w-6 h-6 mx-auto" />
        ) : (
          <Phone className="mr-2" />
        )}
        {isLoading ? 'Calling...' : 'Call'}
      </Button>
    </div>
  );
};

const RecentCalls = () => (
  <ScrollArea className="flex-grow min-h-0 overflow-auto">
    <div className="flex-grow min-h-0">
      {dummyRecentCalls.length > 0 ? (
      dummyRecentCalls.map(call => (
        <Card key={call.id} className="mb-2">
          <CardContent>
            <p>Number: {call.number}</p>
            <p>Duration: {call.duration} seconds</p>
            <p>Cost: ${call.cost}</p>
          </CardContent>
        </Card>
      ))
      ) : (
        <p className="text-center text-gray-500">
          <Clock className="h-6 w-6 mx-auto mb-2" />
            No recent calls found.
        </p>
      )}
    </div>
  </ScrollArea>
);

const Contacts = () => (
  <ScrollArea className="flex-grow min-h-0 overflow-auto">
    <div className="flex-grow min-h-0">
      {dummyContacts.length > 0 ? (
      dummyContacts.map(contact => (
        <Card key={contact.id} className="mb-2">
          <CardContent>
            <p>{contact.name}</p>
            <p>Number: {contact.number}</p>
          </CardContent>
        </Card>
      ))
      ) : (
        <p className="text-center text-gray-500">
          <Clock className="h-6 w-6 mx-auto mb-2" />
          No contacts found.
        </p>
      )}
    </div>
  </ScrollArea>
);

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('keypad');
  const {toast} = useToast();

  const handleCall = async () => {
    setIsLoading(true);
    try {
      const callRequest = {
        phoneNumber: phoneNumber,
        countryCode: countryCode,
      };
      const callData = await initiateCall(callRequest);

      setCallInfo(callData);
      toast({
        title: 'Call initiated',
        description: `Call duration: ${callData.duration} seconds, Cost: $${callData.cost}`,
      });
    } catch (error: any) {
      console.error('Call initiation failed:', error);
      const errorMessage = error?.message || 'Failed to initiate call. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error initiating call',
        description:
          error.message || 'Failed to initiate call. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-secondary">
      <Card className="w-[400px] h-[600px] space-y-4 p-4 rounded-lg shadow-md flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Global Connect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
  <TabContent value="keypad" className="outline-none flex-grow">
    <Keypad
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      countryCode={countryCode}
      setCountryCode={setCountryCode}
      isLoading={isLoading}
      handleCall={handleCall}
    />
  </TabContent>
  <TabContent value="recent" className="outline-none flex-grow">
    <RecentCalls />
  </TabContent>
  <TabContent value="contacts" className="outline-none flex-grow">
    <Contacts />
  </TabContent>
  <TabsList className="flex justify-between mt-4 sticky bottom-0 bg-secondary z-10">
    <TabsTrigger value="recent" className="flex flex-col items-center">
      <Clock className="mr-2 h-4 w-4" />
      Recent
    </TabsTrigger>
    <TabsTrigger value="keypad" className="flex flex-col items-center">
      <Phone className="mr-2 h-4 w-4" />
      Keypad
    </TabsTrigger>
    <TabsTrigger value="contacts" className="flex flex-col items-center">
      <Contact className="mr-2 h-4 w-4" />
      Contacts
    </TabsTrigger>
  </TabsList>
</Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
