'use client';

import { Button } from '@/components/ui/button';
import { sendToReferat } from '@/lib/actions/odznaki/odznaki';

import { toast } from 'sonner';

const SendToReferat = ({ userId }: { userId: string }) => {
  const sendToReferatHandler = async () => {
    toast('Wysłano do referatu');

    await sendToReferat(userId as string);
  };
  return <Button onClick={sendToReferatHandler}>Wyślij do referatu</Button>;
};

export default SendToReferat;
