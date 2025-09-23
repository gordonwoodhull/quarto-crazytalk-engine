# cRaZyTaLk markdown engine for Quarto

Because Quarto is not currently available as a package, put this directory adjacent to `quarto-cli`, e.g. I have `~/src/quarto-cli` and `~/src/quarto-crazytalk-engine`.

To enable cRaZyTaLk in your quarto project, use the `feature/external-engines` branch of Quarto and add

```yaml
engines:
  - url: "../../../quarto-crazytalk-engine/crazytalk.ts"
```

to your `_quarto.yml`.
