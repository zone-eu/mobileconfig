/// <reference types="node" />

export type HashAlg = 'sha256' | 'sha512' | 'sha384' | 'sha224' | 'sha1' | 'md5' | 'ripemd160';

export type SigAlg =
    | 'SHA256withRSA'
    | 'SHA512withRSA'
    | 'SHA384withRSA'
    | 'SHA224withRSA'
    | 'SHA1withRSA'
    | 'MD5withRSA'
    | 'RIPEMD160withRSA'
    | 'SHA256withECDSA'
    | 'SHA512withECDSA'
    | 'SHA384withECDSA'
    | 'SHA224withECDSA'
    | 'SHA1withECDSA'
    | 'SHA256withSA'
    | 'SHA512withSA'
    | 'SHA384withSA'
    | 'SHA224withSA'
    | 'SHA1withDSA';

export type PemValue = string | Buffer;
export type NullableString = string | false | undefined;
export type Callback<T> = (err: Error | null | unknown, data?: T) => void;
export type SignedAttr = { attr: string; type?: string; hex?: string };

export interface SigningOptions {
    key?: PemValue;
    cert?: PemValue;
    ca?: PemValue | PemValue[];
    hashAlg?: HashAlg;
    sigAlg?: SigAlg;
    signingTime?: boolean;
}

export interface ImapOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
}

export interface SmtpOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    username?: NullableString;
    password?: NullableString;
}

export interface DavOptions {
    hostname?: string;
    port?: number;
    secure?: boolean;
    principalurl?: string;
    username?: string;
    password?: string;
}

export interface WifiNetworkOptions {
    encryptionType: string;
    ssid: string;
    password: string;
}

export interface BaseProfileOptions {
    organization?: string | false;
    identifier?: string;
    displayName?: string;
    displayDescription?: string;
    accountName?: string | false;
    accountDescription?: string | false;
    contentUuid?: string;
    plistUuid?: string;
}

export interface EmailConfigOptions extends BaseProfileOptions {
    emailAddress?: string;
    emailAccountName?: string | false;
    imap?: ImapOptions;
    smtp?: SmtpOptions;
}

export interface SignedEmailConfigOptions extends EmailConfigOptions {
    keys?: SigningOptions;
}

export interface DavConfigOptions extends BaseProfileOptions {
    emailAddress?: string;
    dav?: DavOptions;
}

export interface SignedDavConfigOptions extends DavConfigOptions {
    keys?: SigningOptions;
}

export interface WifiConfigOptions {
    organization?: string | false;
    displayName?: string;
    wifi?: WifiNetworkOptions;
    contentUuid?: string;
    plistUuid?: string;
}

export interface SignedWifiConfigOptions extends WifiConfigOptions {
    keys?: SigningOptions;
}

export type PlistPrimitive = string | number | boolean | Date | Buffer;
export type PlistValue = PlistPrimitive | PlistObject | PlistValue[];
export interface PlistObject {
    [key: string]: PlistValue;
}

export interface Mobileconfig {
    sign(value: string | Buffer, options: SigningOptions | undefined, callback: Callback<Buffer>): void;
    getEmailConfig(options?: EmailConfigOptions): string;
    getEmailConfig(options: EmailConfigOptions | undefined, callback: Callback<string>): void;
    getSignedEmailConfig(options: SignedEmailConfigOptions, callback: Callback<Buffer>): void;
    getCardDAVConfig(options?: DavConfigOptions): string;
    getCardDAVConfig(options: DavConfigOptions | undefined, callback: Callback<string>): void;
    getSignedCardDAVConfig(options: SignedDavConfigOptions, callback: Callback<Buffer>): void;
    getCalDAVConfig(options?: DavConfigOptions): string;
    getCalDAVConfig(options: DavConfigOptions | undefined, callback: Callback<string>): void;
    getSignedCalDAVConfig(options: SignedDavConfigOptions, callback: Callback<Buffer>): void;
    getWifiConfig(options: WifiConfigOptions): string;
    getWifiConfig(options: WifiConfigOptions, callback: Callback<string>): void;
    getSignedWifiConfig(options: SignedWifiConfigOptions, callback: Callback<Buffer>): void;
    getSignedConfig(plistData: PlistObject, keys: SigningOptions, callback: Callback<Buffer>): void;
}
