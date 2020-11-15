import React from 'react';
import { Text } from 'react-native';
import { TYPOGRAPHY } from '../Theme/library';

export default function Typography({
  children,
  align,
  color,
  variant,
  family,
  transform,
  style,
  ...rest
}) {
  const typographyStyling = {
    textAlign: align,
    color: color,
    fontSize: TYPOGRAPHY.variant[variant],
    fontFamily: family,
    letterSpacing: TYPOGRAPHY.letterSpacing,
    textTransform: transform,
  };

  return (
    <Text style={[typographyStyling, style]} {...rest}>
      {children}
    </Text>
  );
}

// Typography.defaultProps = {
//   children: null,
//   align: 'left',
//   color: TYPOGRAPHY.color,
//   variant: 'default',
//   family: 'medium',
//   transform: 'none',
//   style: {},
// };

// Typography.propTypes = {
//   children: PropTypes.node,
//   align: PropTypes.oneOfType([
//     PropTypes.oneOf(['right', 'left', 'center']),
//     PropTypes.string,
//   ]),
//   color: PropTypes.string,
//   variant: PropTypes.oneOfType([
//     PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'caption', 'default']),
//     PropTypes.string,
//   ]),
//   family: PropTypes.oneOfType([
//     PropTypes.oneOf(['thin', 'medium', 'bold']),
//     PropTypes.string,
//   ]),
//   transform: PropTypes.oneOfType([
//     PropTypes.oneOf(['none', 'uppercase', 'lowercase', 'capitalize']),
//     PropTypes.string,
//   ]),
//   style: ViewPropTypes.style,
// };
