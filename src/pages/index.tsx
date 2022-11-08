import { usePreviewSubscription } from '@/lib/sanity';
import { getClient, overlayDrafts } from '@/lib/sanity.server';
import queries from '@/lib/queries';
import SocialNetworking from '@/components/SocialNetworking';
import DonationV2 from '@/components/DonationV2';
import DonationV1 from '@/components/DonationV1';
import Speakers from '@/components/Speakers';
import Community from '@/components/Community';
import {CommunityT, DonationV1T, DonationV2T, SocialNetworkingListT, SpeakersT} from 'types';


export default function Index({
  socialNetworksList: initialSocialNetworksList,
  donationV1: initialDonationV1,
  donationV2: initialDonationV2,
  speakers: initialSpeakers,
  community: initialCommunity,
  preview
}) {
  const { data: allDonationV1 } = usePreviewSubscription<DonationV1T[]>(
    queries.donationV1,
    {
      initialData: initialDonationV1,
      enabled: preview
    }
  );
  const { data: allDonationV2 } = usePreviewSubscription<DonationV2T[]>(
    queries.donationV1,
    {
      initialData: initialDonationV2,
      enabled: preview
    }
  );
  const { data: allCommunity } = usePreviewSubscription<CommunityT[]>(
    queries.donationV1,
    {
      initialData: initialCommunity,
      enabled: preview
    }
  );
  const { data: allSocialList } = usePreviewSubscription<SocialNetworkingListT>(
    queries.socialNetworksList,
    {
      initialData: initialSocialNetworksList,
      enabled: preview
    }
  );
  const { data: allSpeakers } = usePreviewSubscription<SpeakersT>(
    queries.speakers,
    {
      initialData: initialSpeakers,
      enabled: preview
    }
  );

  return (
    <>
      <SocialNetworking socialList={allSocialList} />
      <DonationV2 donation={allDonationV2[0]} />
      <DonationV1 donation={allDonationV1[0]} />
      <Community community={allCommunity[0]} />
      <Speakers speaker={allSpeakers[0]} />
    </>
  );
}

export async function getStaticProps({ preview = false }) {
  const socialNetworksList = overlayDrafts(
    await getClient(preview).fetch(queries.socialNetworksList)
  );
  const donationV1 = overlayDrafts(
    await getClient(preview).fetch(queries.donationV1)
  );
  const donationV2 = overlayDrafts(
    await getClient(preview).fetch(queries.donationV2)
  );
  const speakers = overlayDrafts(
    await getClient(preview).fetch(queries.speakers)
  );
  const community = overlayDrafts(
    await getClient(preview).fetch(queries.community)
  );

  return {
    props: {
      socialNetworksList,
      donationV1,
      donationV2,
      speakers,
      community,
      preview
    },
    // If webhooks isn't setup then attempt to re-generate in 1 minute intervals
    revalidate: process.env.SANITY_REVALIDATE_SECRET ? undefined : 60
  };
}