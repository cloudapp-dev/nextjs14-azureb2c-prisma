export type AuthTokenResp = {
  access_token: string;
};

export type DecodedPayload = {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  app_displayname: string;
  appid: string;
  appidacr: string;
  idp: string;
  idtyp: string;
  oid: string;
  rh: string;
  roles: string[];
  sub: string;
  tenant_region_scope: string;
  tid: string;
  uti: string;
  ver: string;
  wids: string[];
  xms_tcdt: number;
  xms_tdbr: string;
};
