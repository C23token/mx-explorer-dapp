import * as React from 'react';
import { useGlobalState } from 'context';
import Leaflet from './Leaflet';

const HeroHighlights = () =>
  useGlobalState().activeTestnet.default ? (
    <div className="bg-black">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 pl-0 pr-0">
            <div className="canvas">
              <Leaflet />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

export default HeroHighlights;
