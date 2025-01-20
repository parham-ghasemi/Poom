import VideoStreamProvider from "@/providers/StreamClientProvider"
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <VideoStreamProvider>
        {children}
      </VideoStreamProvider>
    </main>
  )
}

export default RootLayout