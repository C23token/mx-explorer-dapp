import React from 'react';
import elrondLogo from 'assets/img/elrond-symbol.svg';
import ValidatorBrandDetailsRow from './TBrandDetailsRow';
import { ValidatorBrand } from './index';

const ValidatorBrandRow = ({ 
        brand, 
        rank
    } : { 
        brand: ValidatorBrand;
        rank: number;
    }) => {
    const [collapsed, setCollapsed] = React.useState(true);

    return (
        <>
            <tr onClick={(e) => setCollapsed(!collapsed)} className="brand-tr">
                <td>{rank}</td>
                <td>
                    <div className="d-flex align-items-center">
                        <img src={brand.avatar ? brand.avatar : elrondLogo} alt={brand.name} className="mr-3" height="30" />
                        {brand.name ? brand.name : 'N/A'}
                    </div>
                </td>
                <td className="text-right">{brand.validators.length}</td>
                <td className="text-right d-none">{brand.cumulativeUptime}</td>
                <td className="text-right d-none">
                    <div>
                        <span className={"badge badge-pill badge-status " + (
                            brand.cumulativeStatus === 'Online' ? 'badge-success'
                            : (brand.cumulativeStatus === 'Offline' ? 'badge-danger' : 'badge-warning')
                            )}>&nbsp;</span>
                        &nbsp;
                        <span>{brand.cumulativeStatus}</span>
                    </div>
                </td>
                <td className="text-right">{Math.floor(brand.cumulativeRating)}</td>
            </tr>
            <tr className={collapsed ? 'details-tr collapsed' : 'details-tr'}>
                <td colSpan={6} className="p-0">
                    <div className="content">
                        <div className="table-responsive px-4 pt-3" style={{ minHeight: '50px' }}>
                            <table className="table mb-2">
                                <thead>
                                    <tr>
                                        <th>Public Key</th>
                                        <th>Node Name</th>
                                        <th>Shard</th>
                                        <th>Version</th>
                                        <th className="text-right">Uptime</th>
                                        <th className="text-right">Status</th>
                                        <th className="text-right">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brand.validators.map((validator, i) => (
                                        <ValidatorBrandDetailsRow
                                            key={validator.publicKey}
                                            rowIndex={i}
                                            validator={validator}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
  };
  
  export default ValidatorBrandRow;