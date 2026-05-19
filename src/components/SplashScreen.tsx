type SplashScreenProps = {
    isExiting: boolean;
  };
  
  export const SplashScreen = ({ isExiting }: SplashScreenProps) => {
    return (
      <div className={`splash-screen ${isExiting ? "splash-screen--exit" : ""}`}>
        <img
          className="splash-screen__logo"
          src="/icons/splash_screen.png"
          alt="PixelCast"
        />
      </div>
    );
  };