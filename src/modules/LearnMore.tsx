import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import useGlobalStyles from '../utils/useGlobalStyles';

const useStyles = makeStyles((theme) => ({
  underlinedText: {
    textDecorationLine: 'underline',
  },
  boldText: {
    fontWeight: 'bold',
  },
  justifyText: {
    textAlign: 'justify',
    [theme.breakpoints.down('xs')]: {
      whiteSpace: 'pre-wrap',
    },
  },
  topMargin: {
    marginTop: theme.spacing(3),
  },
}));

const LearnMore = () => {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2} className={clsx(globalStyles.componentTopSpacing, globalStyles.componentBottomSpacing)}>
      <Grid item xs={11}>
        <Typography variant="h5" className={clsx(styles.boldText, globalStyles.componentQuarterBottomSpacing)}>Welcome!</Typography>
        <Typography variant="h6" className={styles.justifyText}>
          Thank you for visiting my site! Here are some notes for you to know before placing
          the order 😊
          {'\n\n'}
        </Typography>
        <Typography variant="h6" className={styles.justifyText}>
          Please kindly be noted that all the handmade products are
          <span className={clsx(styles.boldText, globalStyles.italicText)}>
            &quot;made to order&quot;
          </span>
          . Thus, please allow 1 to 2 weeks processing days before the shipment being made. Large
          products like hats or bags might required longer period (about 1-2 months) if yarn
          restocking is needed. Please kindly confirm with the seller before placing the order if
          it is a rush order.
          {'\n\n'}
        </Typography>
        <Typography variant="h6" className={styles.justifyText}>
          Since it is all handmade (with cares and love), please allow 1 to 2 cm varies with the
          dimension stated in the description box. Colour might be slightly differed from the
          image shown due to lighting and different screen projection.
        </Typography>
      </Grid>
      <Grid item xs={11} className={globalStyles.componentTopSpacing}>
        <Typography variant="h6" className={clsx(styles.boldText, styles.underlinedText, globalStyles.componentQuarterBottomSpacing)}>About Custom Order</Typography>
        <Typography variant="h6" className={styles.justifyText}>
          Every custom order is welcomed! Please kindly drop me a DMs in Instagram
          {' '}
          <Link variant="inherit" href="https://www.instagram.com/yj_artjournal/" target="_blank" rel="noopener" color="secondary">
            @yj_artjournal
          </Link>
          {' '}
          or email me at
          {' '}
          <Link variant="inherit" href="mailto:yj.artjournal@gmail.com" target="_blank" rel="noopener" color="secondary">
            yj.artjournal@gmail.com
          </Link>
          {' '}
          for further discussion on your ideas!
        </Typography>
      </Grid>
      <Grid item xs={11} className={globalStyles.componentTopSpacing}>
        <Typography variant="h6" className={clsx(styles.boldText, styles.underlinedText, globalStyles.componentQuarterBottomSpacing)}>About the Shipping (Malaysian only)</Typography>
        <Typography variant="h6" className={styles.justifyText}>
          All the parcels will be shipped via
          <span className={clsx(styles.boldText, globalStyles.italicText)}> Pgeon Delivery</span>
          . Tracking number will be sent to you
          through the email upon completing the order. You may track your parcel through
          {' '}
          <Link variant="inherit" href="https://www.pgeon.delivery/track-parcel" target="_blank" rel="noopener" color="secondary">
            Pgeon Delivery website
          </Link>
          .
        </Typography>
      </Grid>
      <Grid item xs={11} className={globalStyles.componentTopSpacing}>
        <Typography variant="h6" className={clsx(styles.boldText, styles.underlinedText, globalStyles.componentQuarterBottomSpacing)}>About the Payment</Typography>
        <Typography variant="h6" className={styles.justifyText}>
          The payment options provided are
          <span className={clsx(styles.boldText, globalStyles.italicText)}> TNG E-wallet </span>
          and
          <span className={clsx(styles.boldText, globalStyles.italicText)}> Bank Transfer</span>
          . A payment instruction will be sent through email after checking out.
          Please make the payment within 24-hours, or the order will be cancelled.
          The crocheting process will only be started upon confirming the payment.
        </Typography>
      </Grid>
      <Grid item xs={11} className={globalStyles.componentTopSpacing}>
        <Typography variant="h6" className={clsx(styles.boldText, styles.underlinedText, globalStyles.componentQuarterBottomSpacing)}>About Yarn Care</Typography>
        <Typography variant="h6" className={styles.justifyText}>
          Wash it by hand gently to avoid deformation.
          {'\n\n'}
        </Typography>
        <Typography variant="h6" className={styles.justifyText}>
          First of all, soaked the crochet item in room temperature soapy water for about 15 - 30
          mins. Next, rinse it gently. Roll the crochet item with a towel to remove excess water
          and let it dry completely. Avoid drying under direct sunlight to prevent colour fading.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LearnMore;
