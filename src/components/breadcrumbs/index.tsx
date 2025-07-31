"use client";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import startCase from "lodash/startCase";
import includes from "lodash/includes";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { HomeIcon } from "../../icons";
import { CustomLink } from "../custom-link";
import { languages } from "../../i18n";
import { BreadcrumbEnum } from "../../constants";
import { useIsBasicUser, useIsMerchantUser } from "../../api";

const BreadcrumbsView = () => {
  const pathname = usePathname();
  const isBasic = useIsBasicUser();
  const isMerchant = useIsMerchantUser();
  const pathArray = pathname
    .split("/")
  .filter((x) => x && !includes(languages, x) && x.toLowerCase());
  const breadcrumbArray = useMemo(() => {
    return pathArray.map((path, index) => {
      const last = index === pathArray.length - 1;
      const href = `/${pathArray.slice(0, index + 1).join("/")}`;
      
      path =
        path === BreadcrumbEnum.CREATE ? BreadcrumbEnum.CREATE_OFFER : path;
      path =
        path === BreadcrumbEnum.DASHBOARD && isMerchant
          ? BreadcrumbEnum.MERCHANT_DASHBOARD
          : path;
      path =
        path === BreadcrumbEnum.DASHBOARD && isBasic
          ? BreadcrumbEnum.USER_DASHBOARD
          : path;
      if (last) {
        return (
          <Typography
            color="primary"
            key={path}
            sx={{
              typography: { md: "body2Medium", xs: "caption1Medium" },
            }}
          >
            {startCase(decodeURI(path.replaceAll("-", " ")))}
          </Typography>
        );
      }
      if (
        path.toLowerCase().includes("user") ||
        href === "/vehicles/showrooms"
      ) {
        return null;
      }
      return (
        <CustomLink key={path} href={href} prefetch={false}>
          <Typography
            color="grey.GREYISH_BLUE"
            sx={{
              typography: { md: "body2Medium", xs: "caption1Medium" },
            }}
          >
            {startCase(decodeURI(path.replaceAll("-", " ")))}
          </Typography>
        </CustomLink>
      );
    });
  }, [isBasic, isMerchant, pathArray]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <CustomLink color="inherit" href="/" prefetch={false} aria-label="Home">
        <HomeIcon
          sx={{
            display: "flex",
            alignItems: "center",
            color: "grey.GREYISH_BLUE",
            fontSize: "inherit",
          }}
        />
      </CustomLink>
      {breadcrumbArray}
    </Breadcrumbs>
  );
};

export default React.memo(BreadcrumbsView);
