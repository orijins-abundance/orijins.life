// Root component for Human Technology.
// - Wraps the experience in BackgroundProvider so chapters can switch the persistent R3F scene.
// - Mounts the persistent <BackgroundCanvas /> at z-index -1.
// - Mounts the first-run <ConsentGate /> overlay (browsers block autoplay without a gesture).
// - Mounts the <CustomCursor /> on hover-capable, motion-allowed devices.
// - Routes via wouter (single page for now; /404 fallback kept).

import { Route, Switch } from 'wouter';
import ErrorBoundary from './components/ErrorBoundary';
import { BackgroundProvider } from './lib/backgroundContext';
import BackgroundCanvas from './components/three/BackgroundCanvas';
import ConsentGate from './components/overlay/ConsentGate';
import CustomCursor from './components/overlay/CustomCursor';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BackgroundProvider>
        <BackgroundCanvas />
        <CustomCursor />
        <Router />
        <ConsentGate />
      </BackgroundProvider>
    </ErrorBoundary>
  );
}
