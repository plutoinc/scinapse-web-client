import { ProfileInfo } from '../model/profileInfo';
import { getAxiosInstance } from '../api/axios';

export async function getProfileCVInformation(profileSlug: string) {
  // WARN: working at client side only
  const axios = getAxiosInstance();
  try {
    const res = await axios.get(`/profiles/${profileSlug}/information`);
    return res.data.data.content as ProfileInfo;
  } catch (err) {
    // TODO: handle error state
  }
}
