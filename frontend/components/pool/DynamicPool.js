import dynamic from "next/dynamic";

const DynamicPool = dynamic(() => import("./Pool.js"), { ssr: false });

export default DynamicPool;