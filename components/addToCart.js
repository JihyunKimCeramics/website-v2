export default function addToCart(item, cart) {
  const exists = cart.find((cartItem) => cartItem.title === item.title);
  if (exists) {
    return cart;
  }

  return [...cart, item];
}
