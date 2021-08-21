import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {
  DataGrid, GridColDef, GridPageChangeParams,
} from '@material-ui/data-grid';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import ControlledCheckbox from '../../../sharedComponents/ControlledCheckbox';
import ControlledPicker from '../../../sharedComponents/ControlledPicker';
import ControlledRadioButton from '../../../sharedComponents/ControlledRadioButton';
import ControlledTextInput from '../../../sharedComponents/ControlledTextInput';
import CustomBreadcrumbs from '../../../sharedComponents/CustomBreadcrumbs';
import DividerWithText from '../../../sharedComponents/DividerWithText';
import ExpandedCell from '../../../sharedComponents/ExpandedCell';
import { stateOptions } from '../../../utils/constants';
import { formatPrice } from '../../../utils/helper';
import { sendPaymentEmailAction } from '../src/productReducers';
import productSchema from '../src/productSchema';
import productStyle from '../src/productStyle';

const Checkout = () => {
  const styles = productStyle();
  const dispatch = useAppDispatch();
  const currentUserDetails = useAppSelector((state) => state.auth.currentUser);
  const cartItems = useAppSelector((state) => state.product.shoppingCartItem);
  const selectedCheckoutItemsID = useAppSelector((state) => state.product.selectedCheckoutItemsID);
  const prevOrderCount = useAppSelector((state) => state.product.prevOrderCount);
  const prevShippingInfo = useAppSelector((state) => state.product.prevShippingInfo);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [extractedCartItem, setExtractedCartItem] = useState<products.shoppingCartItemData[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const {
    control, watch, setValue, handleSubmit, formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema.shippingInfoSchema),
  });

  useEffect(() => {
    const filteredItems = cartItems.filter((item) => {
      if (selectedCheckoutItemsID.includes(item.id)) {
        const itemPrice = +item.price * +item.quantity;
        // eslint-disable-next-line no-param-reassign
        item = { ...item, itemPrice: itemPrice.toFixed(2) };
        setTotalAmount((prevTotalAmount) => prevTotalAmount + itemPrice);
        return true;
      }
      return false;
    });
    setExtractedCartItem(filteredItems);
  }, [cartItems, selectedCheckoutItemsID]);

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Name', flex: 1, renderCell: ExpandedCell,
    },
    {
      field: 'price', headerName: 'Price per Unit', flex: 1, align: 'center', headerAlign: 'center', sortable: false,
    },
    {
      field: 'quantity', headerName: 'Quantity', flex: 1, align: 'center', headerAlign: 'center', sortable: false,
    },
    {
      field: 'itemPrice',
      headerName: 'Total Price',
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
  ];

  const paymentOptions = [
    { value: 'TNG', label: 'TNG E-Wallet' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
  ];

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize);
  };

  const selectedState = watch('state');
  const outsideMalaysiaState = selectedState && selectedState.value === 'Outside Malaysia';

  useEffect(() => {
    if (!outsideMalaysiaState) {
      setValue('country', 'Malaysia');
    } else {
      setValue('country', '');
    }
  }, [setValue, outsideMalaysiaState]);

  useEffect(() => {
    const eastMalaysia = selectedState && (selectedState.value === 'Sabah' || selectedState.value === 'Sarawak' || selectedState.value === 'Labuan');
    if (selectedState && selectedState.value !== 'Outside Malaysia') {
      if (eastMalaysia) {
        setShippingFee(14);
      } else {
        setShippingFee(7);
      }
    } else {
      setShippingFee(0);
    }
  }, [selectedState]);

  const proceedToPayment = async (hookData:products.submitShippingInfoPayload) => {
    const emailData = {
      ...hookData,
      currentOrderCount: prevOrderCount + 1,
      totalAmount: totalAmount + shippingFee,
      shippingFee,
      selectedCheckoutItems: extractedCartItem,
    } as products.sendEmailPayload;

    dispatch(sendPaymentEmailAction(emailData));
  };

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={11} lg={12}>
        <CustomBreadcrumbs />
      </Grid>
      <Grid item lg={4} xs={11}>
        <Typography variant="h6">Your Order</Typography>
        <Card
          className={clsx(styles.secondaryBorder, {
            [styles.checkoutOrderCard]: !outsideMalaysiaState,
            [styles.outsideMalaysiaCheckoutOrderCard]: outsideMalaysiaState,
          })}
          variant="outlined"
        >
          <Box className={clsx({
            [styles.checkoutItemContainer]: !outsideMalaysiaState,
            [styles.outsideMalaysiaCheckoutItemContainer]: outsideMalaysiaState,
          })}
          >
            <DataGrid
              rows={extractedCartItem}
              columns={columns}
              disableColumnMenu
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              disableSelectionOnClick
              hideFooter
            />
          </Box>
          <Divider />
          <Grid container justifyContent="flex-end" className={styles.totalPayTextContainer}>
            <Grid container>
              <Typography variant="subtitle1" className={`${styles.totalPayText} ${styles.checkListFront}`}>
                Shipping Fee:
              </Typography>
              <Typography variant="subtitle1" className={`${styles.totalPayText} ${styles.checkListBack}`}>
                {shippingFee !== 0 ? formatPrice(shippingFee, 'MYR') : '-'}
              </Typography>
            </Grid>
            <Grid container>
              <Typography variant="subtitle1" className={`${styles.totalPayText} ${styles.checkListFront}`}>
                Total Amount to Pay:
              </Typography>
              <Typography variant="subtitle1" className={`${styles.totalPayText} ${styles.checkListBack}`}>
                {formatPrice(totalAmount + shippingFee, 'MYR')}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item lg={8} xs={11}>
        <form onSubmit={handleSubmit(proceedToPayment)}>
          <Grid item xs={12}>
            <Typography variant="h6">Shipping Information</Typography>
            <Card className={styles.secondaryBorder} variant="outlined">
              <CardContent className={styles.cartTitleCardContent}>
                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                  <Tooltip title="Please login to use this feature" className={styles.proceedPaymentBtnContainer} disableHoverListener={currentUserDetails.uid !== ''}>
                    <span>
                      <Button variant="outlined" color="secondary" disabled={currentUserDetails.uid === ''}>
                        Select address from address book
                      </Button>
                    </span>
                  </Tooltip>
                  <DividerWithText text="Or" />
                  <Grid item xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="fullName"
                      variant="outlined"
                      label="Full Name"
                      lightBg
                      error={errors.fullName}
                      defaultValue={prevShippingInfo.fullName}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="email"
                      variant="outlined"
                      label="Email Address"
                      labelWidth={105}
                      lightBg
                      error={errors.email}
                      defaultValue={prevShippingInfo.email}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="phoneNo"
                      variant="outlined"
                      label="Phone Number"
                      labelWidth={105}
                      lightBg
                      startAdornment={(
                        <InputAdornment position="start">
                          +
                        </InputAdornment>
                        )}
                      error={errors.phoneNo}
                      defaultValue={prevShippingInfo.phoneNo}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="addressLine1"
                      variant="outlined"
                      label="Address Line 1"
                      labelWidth={105}
                      lightBg
                      error={errors.addressLine1}
                      defaultValue={prevShippingInfo.addressLine1}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="addressLine2"
                      variant="outlined"
                      label="Address Line 2"
                      labelWidth={110}
                      lightBg
                      defaultValue={prevShippingInfo.addressLine2}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="postcode"
                      variant="outlined"
                      label="Postcode"
                      lightBg
                      maxLength={10}
                      error={errors.postcode}
                      defaultValue={prevShippingInfo.postcode}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="city"
                      variant="outlined"
                      label="City"
                      lightBg
                      labelWidth={25}
                      error={errors.city}
                      defaultValue={prevShippingInfo.city}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <ControlledPicker
                      control={control}
                      options={stateOptions}
                      name="state"
                      variant="outlined"
                      lightBg
                      label="State"
                      error={errors.state}
                      defaultValue={prevShippingInfo.state}
                    />
                  </Grid>
                  {outsideMalaysiaState && (
                    <Grid item lg={6} xs={12}>
                      <ControlledTextInput
                        control={control}
                        name="outsideMalaysiaState"
                        variant="outlined"
                        label="Foreign Country State"
                        labelWidth={155}
                        lightBg
                        error={errors.outsideMalaysiaState}
                        defaultValue={prevShippingInfo.outsideMalaysiaState}
                      />
                    </Grid>
                  )}
                  <Grid item lg={outsideMalaysiaState ? 12 : 6} xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="country"
                      variant="outlined"
                      label="Country"
                      labelWidth={55}
                      lightBg
                      error={errors.country}
                      defaultValue={prevShippingInfo.country}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ControlledTextInput
                      control={control}
                      name="notesToSeller"
                      variant="outlined"
                      label="Notes to seller (optional)"
                      labelWidth={160}
                      lightBg
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid container justifyContent="flex-start" alignItems="center" className={styles.rmbPadding}>
                    <ControlledCheckbox
                      name="saveShippingInfo"
                      control={control}
                      label="Use this shipping information for the next time"
                      defaultValue={prevShippingInfo.saveShippingInfo}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center" direction="row" alignItems="center" className={styles.proceedPaymentBtnContainer}>
              <Grid item xs={8}>
                <Grid container justifyContent="flex-start" alignItems="center">
                  <ControlledRadioButton
                    control={control}
                    name="paymentOptions"
                    label="Payment Options:"
                    options={paymentOptions}
                    error={errors.paymentOptions}
                    defaultValue={prevShippingInfo.paymentOptions}
                  />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Button variant="contained" color="secondary" size="medium" type="submit">
                    Proceed To Payment
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Checkout;
