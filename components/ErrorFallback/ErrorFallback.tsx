import React from 'react';

import { Container, createStyles, rem, Text, Title } from '@mantine/core';
import { FallbackProps } from 'react-error-boundary';
const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(120),
    backgroundColor: theme.white,
  },
  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(64),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colors[theme.primaryColor][7],
  },
  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.gray[9],
    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },
  description: {
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray[6],
  },
}));
export const ErrorFallback = (e: FallbackProps) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>Upss...</div>
        <Title className={classes.title}>
          Copy the error below and send it to the IT
        </Title>
        <Text size="lg" className={classes.description}>
          {JSON.stringify(e.error, Object.getOwnPropertyNames(e.error))}
        </Text>
      </Container>
    </div>
  );
};
