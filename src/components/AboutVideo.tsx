export function AboutVideo() {
  return (
    <div className="about-video">
      <video
        className="about-video-el"
        src="/video/about.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls
        poster="/images/hero-main.png"
      />
    </div>
  );
}
