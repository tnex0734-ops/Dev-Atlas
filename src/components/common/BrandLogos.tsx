import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Google Play 4-color Vector Logo (Flaticon style)
 */
export const GooglePlayLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Play Logo"
  >
    {/* Left blue segment */}
    <path
      d="M48.5 22.3C41.2 29.8 37 41.5 37 56.4v399.2c0 14.9 4.2 26.6 11.5 34.1l2.8 2.6L276.5 267.1v-6.2L51.3 19.7l-2.8 2.6z"
      fill="#00D2FF"
    />
    {/* Right yellow apex */}
    <path
      d="M352.3 343.3l-75.8-76.2v-6.2l75.8-76.2 1.8 1 89.8 51.2c25.7 14.6 25.7 38.6 0 53.3l-89.8 51.1-1.8 1z"
      fill="#FFCE00"
    />
    {/* Bottom red wing */}
    <path
      d="M354.1 342.3L276.5 264 48.5 492.3c8.6 9.1 22.8 10.2 38.8 1.1l266.8-151.1z"
      fill="#FF3A44"
    />
    {/* Top green wing */}
    <path
      d="M354.1 169.7L87.3 18.6C71.3 9.5 57.1 10.6 48.5 19.7L276.5 248l77.6-78.3z"
      fill="#00F076"
    />
  </svg>
);

/**
 * Reddit Snoo Alien Icon (Flaticon style)
 */
export const RedditLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Reddit Logo"
  >
    <circle cx="256" cy="256" r="256" fill="#FF4500" />
    <path
      fill="#FFFFFF"
      d="M394.4 256.3c0-18.7-15.2-33.9-33.9-33.9-9.1 0-17.3 3.6-23.4 9.4-23.7-16.7-56.1-27.4-92.4-28.5l19.5-91.8 63.8 13.6c.7 15.6 13.5 28 29.3 28 16.2 0 29.4-13.2 29.4-29.4s-13.2-29.4-29.4-29.4c-11.4 0-21.3 6.6-26.2 16.2l-71.1-15.2c-4.4-.9-8.7 1.8-9.8 6.2l-22.3 105c-37.4.9-70.8 11.7-95.1 28.7-6.1-6-14.5-9.8-23.8-9.8-18.7 0-33.9 15.2-33.9 33.9 0 13.3 7.7 24.8 18.9 30.3-1.3 6.6-2 13.4-2 20.4 0 59.8 67 108.3 149.6 108.3s149.6-48.5 149.6-108.3c0-7-.7-13.8-2-20.4 11.2-5.5 18.9-17 18.9-30.3zM182.2 284c0-13.2 10.7-23.9 23.9-23.9s23.9 10.7 23.9 23.9c0 13.2-10.7 23.9-23.9 23.9s-23.9-10.7-23.9-23.9zm148.6 67.8c-18.2 18.2-52.6 19.6-74.8 19.6-22.3 0-56.7-1.4-74.8-19.6-3-3-3-7.8 0-10.7 2.9-2.9 7.7-2.9 10.7 0 13.6 13.6 42.4 15.6 64.1 15.6s50.5-2 64.1-15.6c3-2.9 7.7-2.9 10.7 0 3 2.9 3 7.7 0 10.7zm-24.8-43.9c-13.2 0-23.9-10.7-23.9-23.9s10.7-23.9 23.9-23.9 23.9 10.7 23.9 23.9-10.7 23.9-23.9 23.9z"
    />
  </svg>
);

/**
 * Apple App Store Icon (Flaticon style)
 */
export const AppStoreLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Apple App Store Logo"
  >
    <rect width="512" height="512" rx="112" fill="#0071E3" />
    <path
      fill="#FFFFFF"
      d="M192.5 354.2l-21.7 37.6c-4.4 7.6-14.1 10.2-21.7 5.8-7.6-4.4-10.2-14.1-5.8-21.7l64.8-112.2H92.2c-8.8 0-16-7.2-16-16s7.2-16 16-16h133.5l30.4-52.6-24-41.5c-4.4-7.6-1.8-17.3 5.8-21.7 7.6-4.4 17.3-1.8 21.7 5.8l17.1 29.6 17.1-29.6c4.4-7.6 14.1-10.2 21.7-5.8 7.6 4.4 10.2 14.1 5.8 21.7l-71.3 123.5 28.5 49.3h53.7l65-112.6c4.4-7.6 14.1-10.2 21.7-5.8 7.6 4.4 10.2 14.1 5.8 21.7l-46.8 81h41.7c8.8 0 16 7.2 16 16s-7.2 16-16 16h-60.2l-21.7 37.6c-4.4 7.6-14.1 10.2-21.7 5.8-7.6-4.4-10.2-14.1-5.8-21.7l14.4-25H206.9l-14.4 25z"
    />
  </svg>
);

/**
 * Discord Clyde Icon (Flaticon style)
 */
export const DiscordLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Discord Logo"
  >
    <circle cx="256" cy="256" r="256" fill="#5865F2" />
    <path
      fill="#FFFFFF"
      d="M372.4 153.8c-23.7-10.9-49.1-18.9-75.7-23.6-3.3 5.9-7.2 13.9-9.8 20.2-28.3-4.2-56.3-4.2-84.1 0-2.7-6.3-6.6-14.3-10-20.2-26.6 4.7-52 12.7-75.7 23.6-48.1 71.9-61.2 142-54.7 211.2 31.9 23.6 62.8 38 93.3 47.4 7.6-10.3 14.3-21.3 20-33-11-4.1-21.5-9.3-31.4-15.6 2.6-1.9 5.2-3.9 7.7-5.9 61 28.2 127.3 28.2 187.6 0 2.5 2 5.1 4 7.7 5.9-9.9 6.3-20.4 11.5-31.5 15.6 5.7 11.7 12.4 22.7 20 33 30.5-9.4 61.5-23.8 93.4-47.4 7.7-80.1-13.4-149.7-54.8-211.2zM194.3 297.8c-18.8 0-34.3-17.3-34.3-38.5 0-21.3 15.1-38.6 34.3-38.6 19.3 0 34.7 17.5 34.3 38.6 0 21.2-15.1 38.5-34.3 38.5zm123.4 0c-18.8 0-34.3-17.3-34.3-38.5 0-21.3 15.1-38.6 34.3-38.6 19.3 0 34.7 17.5 34.3 38.6 0 21.2-15.1 38.5-34.3 38.5z"
    />
  </svg>
);

/**
 * GitHub Octocat Icon (Flaticon style)
 */
export const GitHubLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="GitHub Logo"
  >
    <circle cx="256" cy="256" r="256" fill="#18181B" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#FFFFFF"
      d="M256 90C164.3 90 90 164.3 90 256c0 73.4 47.6 135.6 113.6 157.6 8.3 1.5 11.3-3.6 11.3-8 0-4-.2-17.1-.2-31.1-46.2 10-56-19.6-56-19.6-7.6-19.2-18.5-24.3-18.5-24.3-15.1-10.3 1.1-10.1 1.1-10.1 16.7 1.2 25.5 17.1 25.5 17.1 14.8 25.4 38.9 18.1 48.4 13.8 1.5-10.7 5.8-18.1 10.5-22.3-36.9-4.2-75.7-18.4-75.7-82.1 0-18.2 6.5-33 17.1-44.7-1.7-4.2-7.4-21.1 1.6-44.1 0 0 14-4.5 45.8 17.1 13.3-3.7 27.6-5.5 41.8-5.6 14.2.1 28.5 1.9 41.8 5.6 31.8-21.6 45.7-17.1 45.7-17.1 9.1 23 3.4 39.9 1.7 44.1 10.7 11.6 17.1 26.5 17.1 44.7 0 63.8-38.9 77.8-75.9 81.9 6 5.1 11.3 15.3 11.3 30.8 0 22.3-.2 40.2-.2 45.7 0 4.4 3 9.6 11.4 8C374.5 391.5 422 329.4 422 256c0-91.7-74.3-166-166-166z"
    />
  </svg>
);

/**
 * Support Desk Customer Care Headset (Flaticon style)
 */
export const SupportDeskLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Support Desk Logo"
  >
    <circle cx="256" cy="256" r="256" fill="#0D9488" />
    <path
      fill="#FFFFFF"
      d="M256 128c-70.7 0-128 57.3-128 128v48c0 17.7 14.3 32 32 32h16c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16h-31.5c3.2-53.7 47.9-96 103.5-96 55.6 0 100.3 42.3 103.5 96H320c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h16c17.7 0 32-14.3 32-32v-48c0-70.7-57.3-128-128-128zm32 240h-64c-8.8 0-16 7.2-16 16s7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
    />
  </svg>
);

/**
 * User Survey Clipboard (Flaticon style)
 */
export const SurveyLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="User Survey Logo"
  >
    <circle cx="256" cy="256" r="256" fill="#8B5CF6" />
    <path
      fill="#FFFFFF"
      d="M336 128h-32v-16c0-17.7-14.3-32-32-32h-32c-17.7 0-32 14.3-32 32v16h-32c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48h160c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48zm-112 0v-16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v16h-64zm80 208H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16zm32-64H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h128c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0-64H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h128c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
    />
  </svg>
);

/**
 * All Telemetry Streams Multi-channel Signal Logo
 */
export const AllChannelsLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="All Ingestion Streams"
  >
    <circle cx="256" cy="256" r="256" fill="#161616" />
    <path
      fill="#FF6039"
      d="M148 220c-9.9 0-18 8.1-18 18v76c0 9.9 8.1 18 18 18s18-8.1 18-18v-76c0-9.9-8.1-18-18-18zm72-52c-9.9 0-18 8.1-18 18v180c0 9.9 8.1 18 18 18s18-8.1 18-18V186c0-9.9-8.1-18-18-18zm72-52c-9.9 0-18 8.1-18 18v284c0 9.9 8.1 18 18 18s18-8.1 18-18V154c0-9.9-8.1-18-18-18zm72 68c-9.9 0-18 8.1-18 18v148c0 9.9 8.1 18 18 18s18-8.1 18-18V222c0-9.9-8.1-18-18-18z"
    />
  </svg>
);

/**
 * Android Robot Head Logo (Flaticon style)
 */
export const AndroidLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Android Logo"
  >
    <path
      fill="#3DDC84"
      d="M375.4 140.6l37.2-64.4c4.6-8 1.8-18.2-6.2-22.8-8-4.6-18.2-1.8-22.8 6.2l-38.6 66.8c-26.7-12.2-56.9-19.4-89-19.4s-62.3 7.2-89 19.4l-38.6-66.8c-4.6-8-14.8-10.8-22.8-6.2-8 4.6-10.8 14.8-6.2 22.8l37.2 64.4C108.9 178.6 69.3 241.9 64 316.5h384c-5.3-74.6-44.9-137.9-72.6-175.9zM164 246.5c-14.1 0-25.5-11.4-25.5-25.5s11.4-25.5 25.5-25.5 25.5 11.4 25.5 25.5-11.4 25.5-25.5 25.5zm184 0c-14.1 0-25.5-11.4-25.5-25.5s11.4-25.5 25.5-25.5 25.5 11.4 25.5 25.5-11.4 25.5-25.5 25.5z"
    />
  </svg>
);

/**
 * Apple Logo (Flaticon style)
 */
export const AppleLogo: React.FC<LogoProps> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 170 170"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Apple Logo"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.85-8.03-12.44-14.84-6.3-9.35-11.27-20.06-14.9-32.13-3.64-12.06-5.46-23.77-5.46-35.12 0-14.54 3.8-26.69 11.39-36.45 7.59-9.76 17.07-14.76 28.43-15 4.36 0 9.29 1.17 14.78 3.52 5.5 2.35 9.4 3.58 11.71 3.7 2.12-.12 6.13-1.41 12.02-3.88 5.89-2.47 10.74-3.58 14.55-3.34 11.51.5 20.91 4.79 28.18 12.87-9.52 5.76-14.19 13.9-14.02 24.41.21 8.52 3.42 15.75 9.63 21.69 6.21 5.94 13.59 9.39 22.14 10.35-2.22 6.53-4.99 13.06-8.32 19.59zM119.22 31.86c0-6.73 2.45-13.2 7.35-19.41 4.9-6.21 11-10.63 18.3-13.26.11 1.09.16 1.95.16 2.58 0 6.64-2.5 13.11-7.51 19.41-5.01 6.3-11.08 10.7-18.2 13.2-.05-.87-.1-1.71-.1-2.52z" />
  </svg>
);

/**
 * Universal Brand Logo Component
 */
export const BrandLogo: React.FC<{ source: string; className?: string }> = ({
  source,
  className = 'h-4 w-4',
}) => {
  switch (source) {
    case 'Google Play':
      return <GooglePlayLogo className={className} />;
    case 'Reddit':
      return <RedditLogo className={className} />;
    case 'App Store':
      return <AppStoreLogo className={className} />;
    case 'Discord':
      return <DiscordLogo className={className} />;
    case 'GitHub Issues':
    case 'GitHub':
      return <GitHubLogo className={className} />;
    case 'Support Desk':
      return <SupportDeskLogo className={className} />;
    case 'User Survey':
    case 'Surveys':
      return <SurveyLogo className={className} />;
    case 'All':
    default:
      return <AllChannelsLogo className={className} />;
  }
};
