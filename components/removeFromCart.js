export default function removeFromCart(item, cart) {
  const itemToRemove = cart.find((cartItem) => cartItem.title === item.title);
  return cart.remove(itemToRemove);
}
