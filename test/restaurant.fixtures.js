function makeRestaurantsArray() {
  return [
    {
      id: 1,
      the_restaurant: 'First test post!',
      type: 'Keto'
    },
    {
      id: 2,
      the_restaurant: 'Second test post!',
      type: 'Mediterranean'
    },
    {
      id: 3,
      the_restaurant: 'Third test post!',
      type: 'Plant-based'
    },
  ];
}

function makeMaliciousRestaurant() {
  const maliciousRestaurant = {
    id: 911,
    the_restaurant: 'Naughty naughty very naughty <script>alert("xss");</script>',
    type: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedRestaurant = {
    ...maliciousRestaurant,
    the_restaurant: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    type: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousRestaurant,
    expectedRestaurant,
  }
}

module.exports = {
  makeRestaurantsArray,
  makeMaliciousRestaurant,
}