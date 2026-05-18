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

/**
 * Plain plist-compatible object used for arbitrary mobileconfig profiles.
 *
 * Common Apple configuration profile and managed mail payload fields are listed
 * explicitly for editor completion, while additional plist keys remain allowed.
 */
export interface PlistObject {
    /** Apple payload type, for example `Configuration` or `com.apple.mail.managed`. */
    PayloadType?: string;
    /** Apple payload schema version, usually `1`. */
    PayloadVersion?: number;
    /** Reverse-DNS identifier for the profile or payload. */
    PayloadIdentifier?: string;
    /** UUID for the profile or payload. */
    PayloadUUID?: string;
    /** Display name shown for the profile or payload. */
    PayloadDisplayName?: string;
    /** Description shown for the profile or payload. */
    PayloadDescription?: string;
    /** Organization shown for the profile or payload. */
    PayloadOrganization?: string;
    /** Nested payload objects contained by a top-level `Configuration` profile. */
    PayloadContent?: PlistObject[];
    /** Description for the configured email account. */
    EmailAccountDescription?: string | false;
    /** Display name for the configured email account. */
    EmailAccountName?: string;
    /** Email account type, for example `EmailTypeIMAP`. */
    EmailAccountType?: string;
    /** Email address configured for the account. */
    EmailAddress?: string;
    /** Incoming mail authentication method, for example `EmailAuthPassword`. */
    IncomingMailServerAuthentication?: string;
    /** Incoming mail server hostname. */
    IncomingMailServerHostName?: string;
    /** Incoming mail server port. */
    IncomingMailServerPortNumber?: number;
    /** Whether the incoming mail server uses SSL/TLS. */
    IncomingMailServerUseSSL?: boolean;
    /** Incoming mail server username. */
    IncomingMailServerUsername?: string;
    /** Incoming mail account password. */
    IncomingPassword?: string;
    /** Whether outgoing mail should reuse the incoming password. */
    OutgoingPasswordSameAsIncomingPassword?: boolean;
    /** Outgoing mail authentication method, for example `EmailAuthPassword`. */
    OutgoingMailServerAuthentication?: string;
    /** Outgoing mail server hostname. */
    OutgoingMailServerHostName?: string;
    /** Outgoing mail server port. */
    OutgoingMailServerPortNumber?: number;
    /** Whether the outgoing mail server uses SSL/TLS. */
    OutgoingMailServerUseSSL?: boolean;
    /** Outgoing mail server username. */
    OutgoingMailServerUsername?: string;
    /** Whether messages may be moved out of the account. */
    PreventMove?: boolean;
    /** Whether the account may send from third-party apps. */
    PreventAppSheet?: boolean;
    /** Whether S/MIME is enabled for the account. */
    SMIMEEnabled?: boolean;
    /** Whether Mail Drop is allowed for the account. */
    allowMailDrop?: boolean;
    /** Additional plist-compatible key-value pairs. */
    [key: string]: PlistValue | undefined;
}

export interface Mobileconfig {
    /**
     * Signs a mobileconfig plist value as a CMS SignedData object.
     *
     * @param value XML plist content to sign. The value is converted to UTF-8 bytes before signing.
     * @param options Private key, signer certificate, optional CA chain, and signature algorithm settings.
     * @param callback Called asynchronously with an error or the DER-encoded signed mobileconfig buffer.
     */
    sign(value: string | Buffer, options: SigningOptions | undefined, callback: Callback<Buffer>): void;

    /**
     * Builds an unsigned IMAP/SMTP account configuration profile.
     *
     * @param options Profile metadata, email address, incoming IMAP settings, and outgoing SMTP settings.
     * @returns The generated XML plist string.
     */
    getEmailConfig(options?: EmailConfigOptions): string;

    /**
     * Builds an unsigned IMAP/SMTP account configuration profile.
     *
     * @param options Profile metadata, email address, incoming IMAP settings, and outgoing SMTP settings.
     * @param callback Called with an error or the generated XML plist string.
     */
    getEmailConfig(options: EmailConfigOptions | undefined, callback: Callback<string>): void;

    /**
     * Builds and signs an IMAP/SMTP account configuration profile.
     *
     * @param options Email profile settings plus signing keys under `options.keys`.
     * @param callback Called with an error or the DER-encoded signed mobileconfig buffer.
     */
    getSignedEmailConfig(options: SignedEmailConfigOptions, callback: Callback<Buffer>): void;

    /**
     * Builds an unsigned CardDAV account configuration profile.
     *
     * @param options Profile metadata, email address, and CardDAV server settings.
     * @returns The generated XML plist string.
     */
    getCardDAVConfig(options?: DavConfigOptions): string;

    /**
     * Builds an unsigned CardDAV account configuration profile.
     *
     * @param options Profile metadata, email address, and CardDAV server settings.
     * @param callback Called with an error or the generated XML plist string.
     */
    getCardDAVConfig(options: DavConfigOptions | undefined, callback: Callback<string>): void;

    /**
     * Builds and signs a CardDAV account configuration profile.
     *
     * @param options CardDAV profile settings plus signing keys under `options.keys`.
     * @param callback Called with an error or the DER-encoded signed mobileconfig buffer.
     */
    getSignedCardDAVConfig(options: SignedDavConfigOptions, callback: Callback<Buffer>): void;

    /**
     * Builds an unsigned CalDAV account configuration profile.
     *
     * @param options Profile metadata, email address, and CalDAV server settings.
     * @returns The generated XML plist string.
     */
    getCalDAVConfig(options?: DavConfigOptions): string;

    /**
     * Builds an unsigned CalDAV account configuration profile.
     *
     * @param options Profile metadata, email address, and CalDAV server settings.
     * @param callback Called with an error or the generated XML plist string.
     */
    getCalDAVConfig(options: DavConfigOptions | undefined, callback: Callback<string>): void;

    /**
     * Builds and signs a CalDAV account configuration profile.
     *
     * @param options CalDAV profile settings plus signing keys under `options.keys`.
     * @param callback Called with an error or the DER-encoded signed mobileconfig buffer.
     */
    getSignedCalDAVConfig(options: SignedDavConfigOptions, callback: Callback<Buffer>): void;

    /**
     * Builds an unsigned Wi-Fi network configuration profile.
     *
     * @param options Profile metadata and Wi-Fi SSID, password, and encryption settings.
     * @returns The generated XML plist string.
     */
    getWifiConfig(options: WifiConfigOptions): string;

    /**
     * Builds an unsigned Wi-Fi network configuration profile.
     *
     * @param options Profile metadata and Wi-Fi SSID, password, and encryption settings.
     * @param callback Called with an error or the generated XML plist string.
     */
    getWifiConfig(options: WifiConfigOptions, callback: Callback<string>): void;

    /**
     * Builds and signs a Wi-Fi network configuration profile.
     *
     * @param options Wi-Fi profile settings plus signing keys under `options.keys`.
     * @param callback Called with an error or the DER-encoded signed mobileconfig buffer.
     */
    getSignedWifiConfig(options: SignedWifiConfigOptions, callback: Callback<Buffer>): void;

    /**
     * Serializes and signs an arbitrary mobileconfig plist object.
     *
     * @param plistData Plain plist-compatible object to serialize with `plist.build`.
     * @param keys Private key, signer certificate, optional CA chain, and signature algorithm settings.
     * @param callback Called with an error or the DER-encoded signed mobileconfig buffer.
     */
    getSignedConfig(plistData: PlistObject, keys: SigningOptions, callback: Callback<Buffer>): void;
}
