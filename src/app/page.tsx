'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {CallInfo} from '@/services/phone-call';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {Separator} from '@/components/ui/separator';
import {Phone} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

const dummyRecentCalls = [
  {id: '1', number: '+15551234567', duration: 60, cost: 0.06},
  {id: '2', number: '+442079460000', duration: 120, cost: 0.12},
  {id: '3', number: '+493090197000', duration: 180, cost: 0.18},
];

const dummyContacts = [
  {id: '1', name: 'John Doe', number: '+15555555555'},
  {id: '2', name: 'Jane Smith', number: '+447700900000'},
  {id: '3', name: 'Peter Jones', number: '+4915162900000'},
];

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleCall = async () => {
    setIsLoading(true);
    try {
      // const callRequest: CallRequest = {
      //   phoneNumber: phoneNumber,
      //   countryCode: countryCode,
      // };
      // const callData = await initiateCall(callRequest);
      // setCallInfo(callData);
      // toast({
      //   title: 'Call initiated',
      //   description: `Call duration: ${callData.duration} seconds, Cost: $${callData.cost}`,
      // });
      await new Promise(resolve => setTimeout(resolve, 1000));
      const duration = Math.floor(Math.random() * 300) + 30;
      const cost = duration * 0.001;
      const callData = {duration: duration, cost: parseFloat(cost.toFixed(2))};
      setCallInfo(callData);
      toast({
        title: 'Call initiated',
        description: `Call duration: ${callData.duration} seconds, Cost: $${callData.cost}`,
      });
    } catch (error: any) {
      console.error('Call initiation failed:', error);
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

  const handleNumberInput = (number: string) => {
    setPhoneNumber(prevNumber => prevNumber + number);
  };

  const Keypad = () => (
    <div className="grid grid-cols-3 gap-4 p-4">
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
  );

  const RecentCalls = () => (
    <div className="p-4">
      <CardTitle className="text-lg font-semibold">Recent Calls</CardTitle>
      {dummyRecentCalls.map(call => (
        <Card key={call.id} className="mb-2">
          <CardContent>
            <p>Number: {call.number}</p>
            <p>Duration: {call.duration} seconds</p>
            <p>Cost: ${call.cost}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const Contacts = () => (
    <div className="p-4">
      <CardTitle className="text-lg font-semibold">Contacts</CardTitle>
      {dummyContacts.map(contact => (
        <Card key={contact.id} className="mb-2">
          <CardContent>
            <p>{contact.name}</p>
            <p>Number: {contact.number}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-secondary">
      <Card className="w-full max-w-md space-y-4 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Global Connect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="flex-1 w-full p-3 border rounded"
          />

          <Keypad />

          <Button
            onClick={handleCall}
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? 'Calling...' : <Phone className="mr-2" />}
            {isLoading ? '' : 'Call'}
          </Button>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="keypad"
        className="w-full max-w-md mt-4 p-4 rounded-lg shadow-md"
      >
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="keypad">Keypad</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <RecentCalls />
        </TabsContent>
        <TabsContent value="keypad"></TabsContent>
        <TabsContent value="contacts">
          <Contacts />
        </TabsContent>
      </Tabs>

      {callInfo && (
        <Card className="w-full max-w-md mt-4 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Call Information
            </CardTitle>
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
