import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import { Cancel, Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

type variantData='standard' | 'filled' | 'outlined'

interface ControlledPasswordInputOwnProps{
  control:Control,
  label?:string,
  variant?:variantData,
  name:string,
  defaultValue?:string
  error?:FieldError
  labelWidth?:number
}

const useStyles = makeStyles({
  unFocusStyle: {
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'lightgrey',
    },
  },
  unFocusLabel: {
    color: 'white',
  },
  container: {
    width: '80%',
    marginTop: 5,
    marginBottom: 5,
  },
});

const ControlledPasswordInput = (props:ControlledPasswordInputOwnProps) => {
  const {
    control, label, variant, name, defaultValue, error, labelWidth,
  } = props;

  const [secure, setSecure] = useState(true);

  const styles = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: {
          onChange, value,
        },
      }) => (
        <FormControl variant={variant} className={styles.container}>
          <InputLabel htmlFor={name} classes={{ root: styles.unFocusLabel }} error={!!error}>
            {label}
          </InputLabel>
          <OutlinedInput
            id={name}
            type={!secure ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setSecure(!secure)}
                  edge="end"
                  className={styles.unFocusLabel}
                >
                  {!secure ? <Visibility color={error ? 'error' : 'inherit'} /> : <VisibilityOff color={error ? 'error' : 'inherit'} />}
                </IconButton>
                <IconButton
                  edge="end"
                >
                  {error && <Cancel color="error" />}
                </IconButton>
              </InputAdornment>
            )}
            labelWidth={labelWidth}
            classes={{ root: styles.unFocusStyle }}
            error={!!error}
          />
          <FormHelperText error>{error?.message}</FormHelperText>
        </FormControl>
      )}
      defaultValue={defaultValue}
    />
  );
};

ControlledPasswordInput.defaultProps = {
  defaultValue: '',
  variant: undefined,
  label: '',
  error: null,
  labelWidth: 70,
};

export default ControlledPasswordInput;