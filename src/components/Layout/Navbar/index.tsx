import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../../../context';
import elrondLogo from './../../../assets/img/elrond.svg';
import TestnetSwitcher from './TestnetSwitcher';

import { TestnetLink, Search } from './../../../sharedComponents';

export default function SiteNavbar() {
  const [expanded, setExpanded] = React.useState(false);
  const {
    activeTestnet: { validators },
    activeTestnetId,
  } = useGlobalState();

  const onToggle = (isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  const { pathname } = useLocation();

  return (
    <Navbar collapseOnSelect expand="md" onToggle={onToggle} expanded={expanded}>
      <div className="container">
        <TestnetLink className="navbar-brand" to="/">
          <div className="d-none d-md-block d-lg-block d-xl-block" style={{ marginTop: '-2px' }}>
            <img src={elrondLogo} alt="Elrond logo" />
          </div>
          <div className="d-xs-block d-sm-block d-md-none d-lg-none d-xl-none">
            <img src={elrondLogo} alt="Elrond logo" />
          </div>
        </TestnetLink>
        <Navbar.Toggle aria-controls="navbars" style={{ color: 'black', border: 'none' }}>
          {expanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbars">
          <ul className="navbar-nav mr-auto">
            <li
              className={`nav-item ${pathname.toString().includes('blocks') ? 'active' : ''}`}
              onClick={() => onToggle(false)}
            >
              <TestnetLink className="nav-link" to="/blocks">
                blocks
              </TestnetLink>
            </li>
            <li
              onClick={() => onToggle(false)}
              className={`nav-item ${pathname.toString().includes('transactions') ? 'active' : ''}`}
            >
              <TestnetLink className="nav-link" to="/transactions">
                transactions
              </TestnetLink>
            </li>
            {validators !== false && (
              <li
                onClick={() => onToggle(false)}
                className={`nav-item ${pathname.toString().includes('validators') ? 'active' : ''}`}
              >
                <TestnetLink className="nav-link" to="/validators">
                  validators
                </TestnetLink>
              </li>
            )}
          </ul>
          {!['/', `/${activeTestnetId}`, `/${activeTestnetId}/`].includes(pathname) && (
            <div className="form-search" role="search">
              <div
                className="input-group input-group-seamless float-right"
                style={{ maxWidth: '27rem' }}
              >
                <Search />
              </div>
            </div>
          )}

          <TestnetSwitcher onToggle={onToggle} />
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
