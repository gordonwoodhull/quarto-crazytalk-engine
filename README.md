# cRaZyTaLk markdown engine for Quarto

This is a test of a Quarto external engine, a feature which may arrive in Quarto 1.9. 

This is only a proof of concept and probably not the way external engines will work. In particular, Quarto is not currently available as a package so this needs to access Quarto source files locally.

For this reason, put this directory adjacent to `quarto-cli`, e.g. I have `~/src/quarto-cli` and `~/src/quarto-crazytalk-engine`.

Then, to enable cRaZyTaLk in your quarto project, use the `feature/external-engines` branch of Quarto and add

```yaml
engines:
  - url: "../../../quarto-crazytalk-engine/crazytalk.ts"
```

to your `_quarto.yml`.
