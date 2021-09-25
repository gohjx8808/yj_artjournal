import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import clsx from 'clsx';
import { graphql, Link as GatsbyLink, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../../hooks';
import ControlledTextInput from '../../../sharedComponents/inputs/views/ControlledTextInput';
import useGlobalStyles from '../../../useGlobalStyles';
import routeNames from '../../../utils/routeNames';
import { submitForgotPassword } from '../src/authReducer';
import { forgotPasswordSchema } from '../src/authSchema';
import authenticationStyles from '../src/authStyles';

const ForgotPassword = () => {
  const styles = authenticationStyles();
  const globalStyles = useGlobalStyles();
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "icon.jpeg" }) {
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED)
        }
      }
    }
  `);

  const image = getImage(data.file);
  const dispatch = useAppDispatch();

  const { control, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const submitLogin = useCallback((hookData:auth.submitForgotPasswordPayload) => {
    dispatch(submitForgotPassword(hookData));
  }, [dispatch]);

  return (
    <Grid item xs={12}>
      <Grid container justifyContent="center" alignItems="center" className={styles.spacingVertical}>
        <Grid item xs={10} sm={9} lg={6}>
          <Link component={GatsbyLink} to={routeNames.login} color="textPrimary">
            <Grid container>
              <ArrowBackIcon />
              <Typography>Back to Login</Typography>
            </Grid>
          </Link>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={10} sm={9} lg={6}>
          <Card className={styles.cardBg}>
            <Grid container justifyContent="center" alignItems="center" direction="column">
              <CardHeader
                title="Forgot Password"
                className={styles.whiteText}
              />
              <Box className={styles.loginIconContainer}>
                <GatsbyImage image={image!} alt="icon" imgClassName={styles.icon} />
              </Box>
            </Grid>
            <CardContent>
              <form onSubmit={handleSubmit(submitLogin)}>
                <Grid container justifyContent="center" alignItems="center" spacing={2} className={styles.minorTopSpacing}>
                  <Typography variant="subtitle1" className={clsx(styles.whiteText, globalStyles.centerText)}>Please enter your registered email address below.</Typography>
                  <Grid item xs={12} sm={10}>
                    <ControlledTextInput
                      control={control}
                      name="email"
                      label="Email"
                      formerror={errors.email}
                      type="email"
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="center" alignItems="center" className={styles.spacingVertical}>
                  <Button variant="contained" color="primary" type="submit" className={styles.loginBtn} size="medium">
                    Submit
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
