import { ProfileInfo } from '../model/profileInfo';
import { getAxiosInstance } from '../api/axios';

export async function getProfileCVInformation(profileId: string) {
  // WARN: working at client side only
  const axios = getAxiosInstance();
  try {
    const res = await axios.get(`/profiles/${profileId}/information`);
    return res.data.data.content as ProfileInfo;
  } catch (err) {
    // TODO: handle error state
  }
}
