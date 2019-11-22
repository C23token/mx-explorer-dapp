import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

type AppIdType = 'wallet' | 'explorer' | 'studio' | 'docs';

interface AppsType {
  id: AppIdType;
  name: string;
  to: string;
}

const apps: AppsType[] = [
  {
    id: 'wallet',
    name: 'Wallet',
    to: 'https://wallet.elrond.com/',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    to: 'https://explorer.elrond.com/',
  },
  {
    id: 'studio',
    name: 'Studio',
    to: 'https://studio.elrond.com/',
  },
  {
    id: 'docs',
    name: 'Docs',
    to: 'https://documents.elrond.com/',
  },
];

export default function AppSwitcher({ activeAppId }: { activeAppId: AppIdType }) {
  const hidePopover = () => {
    document.body.click();
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key="popover"
        placement="bottom"
        rootClose
        overlay={
          <Popover id="popover-positioned-bottom" className="appSwitcher">
            <Popover.Content>
              {apps.map(app => {
                return (
                  <a
                    className={`nav-link ${activeAppId === app.id ? 'active' : ''}`}
                    key={app.id}
                    onClick={hidePopover}
                    href={app.to}
                  >
                    {app.name}
                  </a>
                );
              })}
            </Popover.Content>
          </Popover>
        }
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item ml-2">
            <a className="nav-link active" href="/#" onClick={onClick}>
              {(apps.filter(app => app.id === activeAppId).pop() as any).name}{' '}
              <small>
                <FontAwesomeIcon icon={faAngleDown} />
              </small>
            </a>
          </li>
        </ul>
      </OverlayTrigger>
    </>
  );
}
