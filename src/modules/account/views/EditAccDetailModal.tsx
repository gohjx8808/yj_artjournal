import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { Email, Person, Phone } from '@material-ui/icons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import ControlledDatePicker from '../../../sharedComponents/ControlledDatePicker';
import ControlledPicker from '../../../sharedComponents/ControlledPicker';
import ControlledTextInput from '../../../sharedComponents/ControlledTextInput';
import { submitEditAccDetailsAction, toggleEditAccDetailModal } from '../src/accountReducer';
import { editAccountSchema } from '../src/accountScheme';
import accountStyles from '../src/accountStyles';

const EditAccDetailModal = () => {
  const styles = accountStyles();
  const dispatch = useAppDispatch();
  const isEditAccDetailModalOpen = useAppSelector(
    (state) => state.account.isEditAccDetailModalDisplay,
  );
  const currentUserDetails = useAppSelector((state) => state.auth.currentUser);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(editAccountSchema),
  });

  const closeModal = () => {
    dispatch(toggleEditAccDetailModal(false));
  };

  const genderOptions = [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }];

  const onEditSubmit = (hookData:account.rawSubmitEditAccDetailPayload) => {
    const processedPayload:account.submitEditAccDetailPayload = {
      ...hookData, gender: hookData.gender.value,
    };
    dispatch(submitEditAccDetailsAction(processedPayload));
  };

  return (
    <Dialog
      open={isEditAccDetailModalOpen}
      onClose={closeModal}
      aria-labelledby="editAccDetail"
      fullWidth
      maxWidth="md"
    >
      <Grid container justifyContent="center">
        <DialogTitle id="editAccDetail">Edit Account Details</DialogTitle>
      </Grid>
      <form onSubmit={handleSubmit(onEditSubmit)}>
        <DialogContent>
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <ControlledTextInput
                control={control}
                name="fullName"
                variant="outlined"
                lightBg
                label="Full Name"
                labelWidth={68}
                defaultValue={currentUserDetails.fullName}
                startAdornment={<Person />}
                error={errors.fullName}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ControlledTextInput
                control={control}
                name="email"
                variant="outlined"
                lightBg
                label="Email"
                labelWidth={40}
                defaultValue={currentUserDetails.email}
                startAdornment={<Email />}
                error={errors.email}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ControlledTextInput
                control={control}
                name="phoneNumber"
                variant="outlined"
                lightBg
                label="Phone Number"
                labelWidth={100}
                defaultValue={currentUserDetails.phoneNumber}
                startAdornment={<Phone />}
                error={errors.phoneNumber}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ControlledPicker
                control={control}
                name="gender"
                variant="outlined"
                lightBg
                label="Gender"
                options={genderOptions}
                defaultValue={{
                  label: currentUserDetails.gender, value: currentUserDetails.gender,
                }}
                error={errors.gender}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ControlledDatePicker
                control={control}
                name="dob"
                variant="outlined"
                lightBg
                label="Date of Birth"
                defaultValue={currentUserDetails.dob}
                error={errors.dob}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={styles.editAccDetailActionBtnContainer}>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button color="secondary" variant="contained" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAccDetailModal;
