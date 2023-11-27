import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  imageSrc?: string;
  fallbackText?: string;
};

export const Profile = ({ imageSrc, fallbackText }: Props) => {
  return (
    <Avatar>
      <AvatarImage src={imageSrc} alt="Profile image" />
      <AvatarFallback>{fallbackText ?? "Hi"}</AvatarFallback>
    </Avatar>
  );
};

export default Profile;
