export default function addToCart(item, cart) {
  const exists = cart.find((cartItem) => cartItem.id === item.id);
  if (exists) {
    return cart;
  }

  return [...cart, item];
}
