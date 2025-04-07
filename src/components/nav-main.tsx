import { type Icon } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const navigate = useNavigate();

  function handleNav(url: string) {
    console.log(">>>>", url);
    console.log("dfffdsfsfs")
    if (url) {
      navigate(`/${url}`);
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => handleNav(item.url)}
            >
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
