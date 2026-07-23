import dynamic from "next/dynamic";

const App = dynamic(() => import("../src/lib/App"), { ssr: false });

export default function Home() {
  return <App />;
}
