import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Add, Remove } from '@material-ui/icons';
import { navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import CustomBreadcrumbs from '../../../sharedComponents/CustomBreadcrumbs';
import routeNames from '../../../utils/routeNames';
import {
  increaseQuantity, reduceQuantity, removeItemFromCart, updateSelectedCheckoutItemsID,
} from '../src/productReducers';
import productStyle from '../src/productStyle';
import CheckoutErrorSnackbar from './CheckoutErrorSnackbar';
import ItemRemoveConfirmationDialog from './ItemRemoveConfirmationDialog';

type CartItemCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  [key: string]: string | undefined | number
}

const Cart = () => {
  const styles = productStyle();
  const cartTitle = ['Item', 'Price (RM)', 'Quantity', 'Total (RM)'];
  const cartItems = useAppSelector((state) => state.product.shoppingCartItem);
  const selectedCheckoutItemsID = useAppSelector((state) => state.product.selectedCheckoutItemsID);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [toBeRemovedItem, setToBeRemovedItem] = useState<products.shoppingCartItemData>({
    id: '',
    name: '',
    quantity: 0,
    price: '',
    itemPrice: '',
  });
  const [removeConfirmModalDisplay, setRemoveConfirmModalDisplay] = useState<boolean>(false);
  const [isCheckoutError, setIsCheckoutError] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let currentTotal = 0;
    cartItems.map((item) => {
      if (selectedCheckoutItemsID.includes(item.id)) {
        currentTotal += +item.itemPrice;
      }
      return null;
    });
    setTotalAmount(currentTotal);
  }, [cartItems, selectedCheckoutItemsID]);

  const onChangeSelect = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'selectAll') {
      if (event.target.checked) {
        const allIds = [] as string[];
        cartItems.map((item) => {
          allIds.push(item.id);
          return null;
        });
        dispatch(updateSelectedCheckoutItemsID(allIds));
      } else {
        dispatch(updateSelectedCheckoutItemsID([]));
      }
    } else if (event.target.checked) {
      const prevArr = [...selectedCheckoutItemsID, event.target.id];
      dispatch(updateSelectedCheckoutItemsID(prevArr));
    } else {
      const splicedArr = [...selectedCheckoutItemsID];
      splicedArr.splice(splicedArr.indexOf(event.target.id), 1);
      dispatch(updateSelectedCheckoutItemsID(splicedArr));
    }
  };

  const toggleRemoveConfirmModalDisplay = () => {
    setRemoveConfirmModalDisplay(!removeConfirmModalDisplay);
  };

  const onReduceItemQuantity = (cartItem:products.shoppingCartItemData) => {
    if (+cartItem.quantity - 1 === 0) {
      setToBeRemovedItem(cartItem);
      toggleRemoveConfirmModalDisplay();
    } else {
      dispatch(reduceQuantity(cartItem.id));
    }
  };

  const confirmItemRemove = () => {
    const removeIndex = selectedCheckoutItemsID.indexOf(toBeRemovedItem.id);
    if (removeIndex !== -1) {
      const copiedIDs = [...selectedCheckoutItemsID];
      copiedIDs.splice(removeIndex, 1);
      dispatch(updateSelectedCheckoutItemsID(copiedIDs));
    }
    dispatch(removeItemFromCart(toBeRemovedItem.id));
    toggleRemoveConfirmModalDisplay();
  };

  const onIncreaseItemQuantity = (cartItemID:string) => {
    dispatch(increaseQuantity(cartItemID));
  };

  const onCheckout = () => {
    if (selectedCheckoutItemsID.length > 0) {
      navigate(routeNames.checkout);
    } else {
      setIsCheckoutError(true);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={11}>
        <CustomBreadcrumbs />
      </Grid>
      {cartItems.length > 0 ? (
        <>
          <Grid item xs={11}>
            <Card className={styles.cartCard}>
              <CardContent className={styles.cartTitleCardContent}>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={2}>
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Checkbox
                        color="secondary"
                        onChange={onChangeSelect}
                        indeterminate={
                      selectedCheckoutItemsID.length < cartItems.length
                      && selectedCheckoutItemsID.length > 0
                  }
                        checked={selectedCheckoutItemsID.length > 0}
                        id="selectAll"
                        inputProps={{ 'aria-label': 'checkAll' }}
                      />
                    </Grid>
                  </Grid>
                  {cartTitle.map((title) => (
                    <Grid item xs={title === 'Item' ? 4 : 2} key={title}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography className={styles.boldText}>{title}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={11}>
            <Card className={styles.cartCard}>
              <CardContent className={styles.cartTitleCardContent}>
                {cartItems.map((cartItem, index) => (
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    key={cartItem.id}
                    className={`${styles.cartItemCard} ${index === 0 ? '' : styles.topBorderedCartItemCard}`}
                  >
                    <Grid item xs={2}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Checkbox
                          checked={selectedCheckoutItemsID.includes(cartItem.id)}
                          color="secondary"
                          onChange={onChangeSelect}
                          id={cartItem.id}
                          inputProps={{
                            'aria-label': cartItem.id,
                            'data-price': +cartItem.itemPrice,
                          } as CartItemCheckboxProps}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={4}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                      >
                        <Typography>{cartItem.name}</Typography>
                        <Box
                          className={styles.cartItemImageContainer}
                          key={cartItem.img!.images.fallback?.src}
                        >
                          <GatsbyImage
                            image={cartItem.img!}
                            alt={cartItem.id}
                            imgClassName={styles.cartItemImage}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography>{cartItem.price}</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <IconButton
                          onClick={
                        () => onReduceItemQuantity(cartItem)
                      }
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{cartItem.quantity}</Typography>
                        <IconButton onClick={() => onIncreaseItemQuantity(cartItem.id)}>
                          <Add />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography>
                          {cartItem.itemPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={11}>
            <Card className={styles.cartCard}>
              <CardContent className={styles.cartTitleCardContent}>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={10}>
                    <Typography className={styles.totalTitle}>Total</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography className={styles.totalTitle}>
                      RM
                      {' '}
                      {totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={11}>
            <Grid container justifyContent="flex-end">
              <Button variant="contained" color="secondary" size="medium" onClick={onCheckout}>
                Checkout
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid item sm={5} xs={12}>
          <Card className={styles.cartCard}>
            <CardContent className={styles.cartTitleCardContent}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Typography>Your cart is currently empty.</Typography>
                  </Grid>
                  <Grid container direction="row" alignItems="center" justifyContent="center">
                    <Typography>
                      Continue browsing
                      {' '}
                      <Link href={routeNames.products} color="secondary">here</Link>
                      .
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      <ItemRemoveConfirmationDialog
        modalOpen={removeConfirmModalDisplay}
        itemName={toBeRemovedItem.name}
        toggleModal={toggleRemoveConfirmModalDisplay}
        confirmRemove={confirmItemRemove}
      />
      <CheckoutErrorSnackbar
        isSnackbarOpen={isCheckoutError}
        toggleSnackbar={() => setIsCheckoutError(false)}
      />
    </Grid>
  );
};

export default Cart;
