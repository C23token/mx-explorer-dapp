import * as React from 'react';
import { History } from 'history';
import { string, object, mixed } from 'yup';
import { Formik, ErrorMessage } from 'formik';
import cryptoCore from '../lib/cryptoCore';
import { useWalletDispatch } from './../context';

const accessWallet = function accessWallet(kdContent: object, accessPassVal: string) {
  try {
    let account = cryptoCore.loadAccountFromKeyFile(kdContent, accessPassVal);
    return {
      error: '',
      success: true,
      privateKey: account.privateKey.toString('hex'),
      publicKey: account.publicKeyAsString(),
    };
  } catch (e) {
    return {
      error: 'Please check your uploaded file or your password',
      success: false,
      privateKey: '',
      publicKey: '',
    };
  }
};

const initialValues = { accessPass: '', walletFile: {} };

interface AccessFormikType {
  history: History;
  activeTestnetId: string;
  loggedIn: boolean;
}

const AccessFormik = ({ history, activeTestnetId, loggedIn }: AccessFormikType) => {
  if (loggedIn) {
    history.push(`/${activeTestnetId}`);
  }
  let ref = React.useRef(null);
  const dispatch = useWalletDispatch();
  const [fileName, setFileName] = React.useState('Choose file...');

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(
        { accessPass, walletFile },
        { setSubmitting, resetForm, setValues, setErrors }
      ) => {
        const { success, error, privateKey, publicKey } = accessWallet(walletFile, accessPass);
        if (ref.current !== null) {
          if (success) {
            dispatch({ type: 'login', privateKey, publicKey });
            setSubmitting(false);
            resetForm();
            setValues({ accessPass, walletFile });
            history.push(`/${activeTestnetId}`);
          } else {
            setErrors({ accessPass: error });
          }
        }
      }}
      validationSchema={object().shape({
        accessPass: string()
          .required('Required')
          .test('min', 'Please enter at least 9 characters', value => value && value.length >= 9),
        walletFile: mixed().required(),
      })}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          setErrors,
          isSubmitting,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
        } = props;
        return (
          <form onSubmit={handleSubmit} ref={ref}>
            <div className="form-group">
              <label htmlFor="walletFile">Private Key</label>
              <fieldset>
                <div className="custom-file w-100">
                  <input
                    type="file"
                    id="walletFile"
                    name="walletFile"
                    accept="application/json,.json"
                    className="custom-file-input"
                    onChange={event => {
                      const fileReader = new FileReader();
                      fileReader.onload = function(e) {
                        try {
                          const walletContent = JSON.parse(fileReader.result!.toString());
                          setFieldValue('walletFile', walletContent);
                        } catch (e) {
                          setErrors({ walletFile: e.toString() });
                          return;
                        }
                      };
                      if (event !== null) {
                        const { name } = (event as any).currentTarget.files[0];
                        setFileName(name);
                        fileReader.readAsText((event as any).currentTarget.files[0]);
                      }
                    }}
                  />
                  <label className="custom-file-label" htmlFor="walletFile" id="walletFileLabel">
                    {fileName}
                  </label>
                </div>
              </fieldset>
              <ErrorMessage component="div" name="walletFile" className="invalid-feedback" />
            </div>
            <div className="form-group">
              <label htmlFor="accessPass">Password</label>
              <input
                type="password"
                id="accessPass"
                value={values.accessPass}
                onChange={handleChange}
                onBlur={handleBlur}
                name="accessPass"
                className={
                  errors.accessPass && touched.accessPass
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              <ErrorMessage component="div" name="accessPass" className="invalid-feedback" />
            </div>
            <button type="submit" className="btn btn-primary" id="accessWalletBtn">
              {isSubmitting ? 'Unlocking...' : 'Unlock Wallet'}
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

export default AccessFormik;
