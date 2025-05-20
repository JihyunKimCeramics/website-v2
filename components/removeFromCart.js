export default function removeFromCart(item, cart) {
  return cart.filter((cartItem) => cartItem.title !== item.title);
}
