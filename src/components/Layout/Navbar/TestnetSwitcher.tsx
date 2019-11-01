import React from 'react';
import { OverlayTrigger, Popover, Accordion, Card, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../../context';

export default function TestnetSwitcher() {
  const globalState = useGlobalState();

  const liksArray = globalState.config.testnets.map(testnet => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  return (
    <>
      <ul className="navbar-nav mr-auto d-xs-block d-sm-block d-md-none d-lg-none d-xl-none">
        <li className="nav-item">
          <Accordion>
            {/* <CustomToggle eventKey="0">testnets</CustomToggle> */}
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              testnets
              <FontAwesomeIcon icon={faCaretDown} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <ul className="navbar-nav">
                {liksArray.map(link => (
                  <li className="nav-item">
                    <Link className="nav-link" key={link.key} to={`/${link.to}`}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        </li>
      </ul>
      <OverlayTrigger
        trigger="click"
        key="popover"
        placement="bottom"
        rootClose
        overlay={
          <Popover id="popover-positioned-bottom">
            <Popover.Content>
              {liksArray.map(link => (
                <Link className="nav-link" key={link.key} to={`/${link.to}`}>
                  {link.name}
                </Link>
              ))}
            </Popover.Content>
          </Popover>
        }
      >
        <span id="switch" className="switch d-none d-md-block d-lg-block d-xl-block">
          <FontAwesomeIcon icon={faNetworkWired} />
        </span>
      </OverlayTrigger>
    </>
  );
}
