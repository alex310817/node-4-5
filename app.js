const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

let menus = [];
let categories = [];
let dishes = [];

function menuExists(req, res, next) {
  const menuId = req.params.menuId;
  const menu = menus.find(menu => menu.id === menuId);
  if (!menu) return res.status(404).send('Menu not found');
  next();
}

function categoryExists(req, res, next) {
  const categoryId = req.params.categoryId;
  const category = categories.find(category => category.id === categoryId);
  if (!category) return res.status(404).send('Category not found');
  next();
}

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const dish = dishes.find(dish => dish.id === dishId);
  if (!dish) return res.status(404).send('Dish not found');
  next();
}

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

app.get('/menus', (req, res) => {
  res.json(menus);
});

app.get('/menus/:menuId', menuExists, (req, res) => {
  const menu = menus.find(menu => menu.id === req.params.menuId);
  res.json(menu);
});

app.get('/menus/:menuId/categories', menuExists, (req, res) => {
  const categoriesForMenu = categories.filter(category => category.menuId === req.params.menuId);
  res.json(categoriesForMenu);
});

app.post('/menus', (req, res) => {
  const newMenu = { id: uuidv4(), ...req.body };
  menus.push(newMenu);
  res.status(201).json(newMenu);
});

app.put('/menus/:menuId', menuExists, (req, res) => {
  const menuIndex = menus.findIndex(menu => menu.id === req.params.menuId);
  menus[menuIndex] = { ...menus[menuIndex], ...req.body };
  res.json(menus[menuIndex]);
});

app.delete('/menus/:menuId', menuExists, (req, res) => {
  menus = menus.filter(menu => menu.id !== req.params.menuId);
  categories = categories.filter(category => category.menuId !== req.params.menuId);
  dishes = dishes.filter(dish => {
    const category = categories.find(category => category.id === dish.categoryId);
    return category && category.menuId !== req.params.menuId;
  });
  res.sendStatus(204);
});

app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/categories/:categoryId', categoryExists, (req, res) => {
  const category = categories.find(category => category.id === req.params.categoryId);
  res.json(category);
});

app.get('/categories/:categoryId/dishes', categoryExists, (req, res) => {
  const dishesForCategory = dishes.filter(dish => dish.categoryId === req.params.categoryId);
  res.json(dishesForCategory);
});

app.post('/categories', (req, res) => {
  const { menuId, ...categoryData } = req.body;
  const newCategory = { id: uuidv4(), menuId, ...categoryData };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/categories/:categoryId', categoryExists, (req, res) => {
  const categoryId = req.params.categoryId;
  const categoryIndex = categories.findIndex(category => category.id === categoryId);
  categories[categoryIndex] = { ...categories[categoryIndex], ...req.body };
  res.json(categories[categoryIndex]);
});

app.delete('/categories/:categoryId', categoryExists, (req, res) => {
  const categoryId = req.params.categoryId;
  categories = categories.filter(category => category.id !== categoryId);
  dishes = dishes.filter(dish => dish.categoryId !== categoryId);
  res.sendStatus(204);
});

app.get('/dishes', (req, res) => {
  res.json(dishes);
});

app.get('/dishes/:dishId', dishExists, (req, res) => {
  const dish = dishes.find(dish => dish.id === req.params.dishId);
  res.json(dish);
});

app.post('/dishes', (req, res) => {
  const { categoryId, ...dishData } = req.body;
  const newDish = { id: uuidv4(), categoryId, ...dishData };
  dishes.push(newDish);
  res.status(201).json(newDish);
});

app.put('/dishes/:dishId', dishExists, (req, res) => {
  const dishId = req.params.dishId;
  const dishIndex = dishes.findIndex(dish => dish.id === dishId);
  dishes[dishIndex] = { ...dishes[dishIndex], ...req.body };
  res.json(dishes[dishIndex]);
});

app.delete('/dishes/:dishId', dishExists, (req, res) => {
  const dishId = req.params.dishId;
  dishes = dishes.filter(dish => dish.id !== dishId);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3002; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
