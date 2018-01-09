# Shape Setup

The routine starts from `cProdDispatch::Receive_Work`, followed by a cluster of preparations.

## Praparations before actual setup

Praparations like condition judgements, get roll statues, initialize other relevant schedule stuff, unpack input data and so on.

In initialization, if somthing missing , the function aborts setup.

## Build SSU schedule objects

`Build_Setup_Objects()`
`Build_Setup_Pass_Objects()`


## `redrft_perm
`redrft_perm` indicates permissive to allow SSU model to change the draft distribution
The value of `redrft_perm` depends on three parameters:`ssu_load_enab`,`ssu_granted`,`s_CalId`.
```c++
redrft_perm =   ( true  == pcSched->pcSetupD->pcSetup->ssu_load_enab ) &&
    ( true  == pcSched->pcFSSched->pcSSys->state.ssu_granted ) &&
    ( 1 == pcSched->pcFCD->state.s_CalId );
```

## Do setup
`pcShapeSetupD->Main()` 


# `pcShapeSetupD->Main()`

## redrft_perm
Determine iteration based on re-drafting permitted indicator.
`iter` does not mean iteration of shape setup calculation.

```c++
    if ( redrft_perm )
    {
        iter = 1;
    }
    else
    {
        iter = 0;
    }
```
As shown in the code above, `redrft_perm` and `iter` has the same value ( 0 or 1).


## Initialize static objects

Intialize the static objects associated with a dynamic FSPASS

object prior to performing setup calculations to ensure that any

changes made through L2_UTY are captured.

## Copy_Object_Chain()

Copy FSU object chain data into Shape Object Chain


## find last active pointer

Loop thru all Pass objects and find Last Active Pass Pointer

## change indicator

five change indicators for pre-setup of shape model.

- family_chg
- narrow_to_wide_chg
- wide_to_narrow_chg
- prd_chg
- lot_chg

prd_chg is from union of family_chg, narrow_to_wide_chg, wide_to_narrow_chg.
```
    if ( (true == this->family_chg)         || 
         (true == this->narrow_to_wide_chg) || 
         (true == this->wide_to_narrow_chg) )
    {
        this->prd_chg = true;
    }
```

lot_chg is related with family change and thk&wid index change. 
```
       if (  // family change
             ((pcSched->pcFSSched->pcSAMP->state.pr_family > 0) &&
              (abs(pcSched->pcPDI->state.family - pcSched->pcFSSched->pcSAMP->state.pr_family) > 0)) ||
             // gauge range table index change
             ((pcSched->pcFSSched->pcSAMP->state.pr_grt_idx > 0) &&
              (abs(pcSched->pcPDI->state.grt_idx - pcSched->pcFSSched->pcSAMP->state.pr_grt_idx) > 0)) ||
             // width range table index change
             ((pcSched->pcFSSched->pcSAMP->state.pr_wrt_idx > 0) &&
              (abs(pcSched->pcPDI->state.wrt_idx - pcSched->pcFSSched->pcSAMP->state.pr_wrt_idx) > 0)) )
        {
            this->lot_chg = true;
        }
```