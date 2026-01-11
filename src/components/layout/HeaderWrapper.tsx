import { HeaderClient, HeaderProps } from "./Header";
import { verifySession } from "@/lib/session/user";

export const Header = async (props: HeaderProps) => {
  const user = await verifySession();

  if (!user) {
    return null;
  }
  return <HeaderClient {...props} userName={user.userName} />;
};
