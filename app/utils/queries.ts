import axios from 'axios';
import { getServerSession } from 'next-auth';


const getAllBadges = async () => {
  const session = getServerSession();
  // przykladowe fetchowanie
  const res = await axios.get(process.env.NEXT_PUBLIC_BASIC_FETCH_URL, {
    headers: {
      Authorization: `bearer ${session}`,
    },
  });
  return res.data;
};
