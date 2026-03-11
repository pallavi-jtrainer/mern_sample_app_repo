let orderCounter = 10000;

function generateOrderId() {
  orderCounter++;

  return "ORD-" + orderCounter;
}

export default generateOrderId;
