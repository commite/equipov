# who am i game

> Who am i game mobile app

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn start

# build for production with minification
yarn build

# execute linter
yarn lint

# build and deploy app into gh-pages
yarn deploy
```

## Online version

As hybrid apps are essentially web apps, you can view the gh-pages version here:

https://commite.github.io/equipov/#/

## Run on Android

Install JDK 1.8

Install Android SDK from https://developer.android.com/studio/index.html

Choose some directory in your home, like `$HOME/Android/Sdk`

Plug Android device using USB, enabling USB debugging previously. See https://developer.android.com/studio/debug/dev-options.html

``` bash
cordova platform add android
yarn build
cordova run android
```

## Contributing

1. Fork it ( https://github.com/commite/equipov/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
