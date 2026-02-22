export default function removeFromCart(item, cart) {
  return cart.filter((cartItem) => cartItem.id !== item.id);
}
