import React, { useMemo } from 'react';
import RadialGradient from 'react-native-radial-gradient';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { CoinIcon } from '../../coin-icon';
import { Centered, ColumnWithMargins, Row } from '../../layout';
import { Text, TruncatedText } from '../../text';
import {
  convertAmountAndPriceToNativeDisplay,
  updatePrecisionToDisplay,
} from '@rainbow-me/helpers/utilities';
import {
  useAccountSettings,
  useColorForAsset,
  usePriceImpactDetails,
} from '@rainbow-me/hooks';
import { position } from '@rainbow-me/styles';

export const CurrencyTileHeight = 143;

const AmountText = styled(Text).attrs(({ theme: { colors } }) => ({
  color: colors.blueGreyDark80,
  letterSpacing: 'roundedTight',
  size: 'smedium',
  weight: 'semibold',
}))``;

const Container = styled(Centered).attrs({
  direction: 'column',
})`
  border-radius: 30;
  flex: 1;
  height: ${CurrencyTileHeight};
  overflow: hidden;
`;

const Gradient = styled(RadialGradient).attrs(
  ({ theme: { colors }, color, type }) => ({
    center:
      type === 'input' ? [0, 0] : [CurrencyTileHeight, CurrencyTileHeight],
    colors: [colors.alpha(color, 0.04), colors.alpha(color, 0)],
  })
)`
  ${position.cover};
`;

const NativePriceText = styled(TruncatedText).attrs({
  letterSpacing: 'roundedTight',
  size: 'lmedium',
  weight: 'heavy',
})``;

const TruncatedAmountText = styled(AmountText).attrs({
  as: TruncatedText,
})`
  flex-grow: 0;
  flex-shrink: 1;
`;

export default function CurrencyTile({
  amount,
  asset,
  type = 'input',
  ...props
}) {
  const genericAssets = useSelector(state => state.data.genericAssets);
  const { nativeCurrency } = useAccountSettings();
  const colorForAsset = useColorForAsset(asset);
  const { address, symbol } = asset;
  const priceValue = genericAssets[address]?.price?.value ?? 0;
  const {
    color: priceImpactColor,
    isHighPriceImpact,
  } = usePriceImpactDetails();

  const { amountDisplay, priceDisplay } = useMemo(() => {
    const data = [amount, priceValue];
    return {
      amountDisplay: updatePrecisionToDisplay(...data, true),
      priceDisplay: convertAmountAndPriceToNativeDisplay(
        ...data,
        nativeCurrency
      ).display,
    };
  }, [amount, nativeCurrency, priceValue]);

  return (
    <Container {...props}>
      <Gradient color={colorForAsset} type={type} />
      <ColumnWithMargins centered margin={15}>
        <CoinIcon address={address} size={50} symbol={symbol} />
        <ColumnWithMargins centered margin={4} paddingHorizontal={8}>
          <NativePriceText>
            {priceDisplay}
            {isHighPriceImpact && (
              <NativePriceText color={priceImpactColor}>{` 􀇿`}</NativePriceText>
            )}
          </NativePriceText>
          <Row align="center">
            <TruncatedAmountText>
              {`${type === 'output' ? '~' : ''}${amountDisplay}`}
            </TruncatedAmountText>
            <AmountText>{` ${symbol}`}</AmountText>
          </Row>
        </ColumnWithMargins>
      </ColumnWithMargins>
    </Container>
  );
}
