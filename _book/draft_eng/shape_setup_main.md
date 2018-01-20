# Shape Setup

The routine starts from `cProdDispatch::Receive_Work`, followed by a cluster of preparations.

## Praparations before actual setup

Praparations like condition judgements, get roll statues, initialize other relevant schedule stuff, unpack input data and so on.

In initialization, if somthing missing , the function aborts setup.

## Build SSU schedule objects

`Build_Setup_Objects()`
`Build_Setup_Pass_Objects()`


## `redrft_perm`
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
```c++
if ( (true == this->family_chg)         || 
     (true == this->narrow_to_wide_chg) || 
     (true == this->wide_to_narrow_chg) )
{
    this->prd_chg = true;
}
```

lot_chg is related with family change and thk&wid index change. 
```c++
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

## Reset_Verniers
if if roll chage or product occured reset SAMP verniers.




## `pcShapeSetupD->Init()` 

Initialize the dynamic SHAPE SETUP object and other dynamic objects
such as LPCE, LRG, UFD, and TARGT.  In addition, this function
calculates the mechanical actuator soft limits and copies data from
external records to appropriate dynamic objects.


## `pcShapeSetupD->References()` 
Calculate mechanical actuator references used for the purpose of
controlling profile and flatness of the work piece.  In addition,
rolling force can also be modified if configured.


# cShapeSetupD::References


## Initialize the pointers to the dynamic ALC, LPCE and PENV objects
        // Initialize the pointers to the dynamic ALC, LPCE and PENV objects
        // for the previous dynamic FSPASS object.
        pcFSPassD->pcAlcD  = pcFSPassD->pcVecAlcD[ iter ];
        pcFSPassD->pcPEnvD = pcFSPassD->pcVecPEnvD[ iter];
        pcFSPassD->pcLPceD = pcFSPassD->pcAlcLPceD[ iter ];

while loop for Initialize object from first pass to last active pass

```c++
pcFSPassD = pcFstFSPassD;
while ( pcFSPassD != NULL )
        {
            line_num = __LINE__;
            //----------------------------------------------------------
            // Initialize the pointers to the dynamic ALC, LPCE and PENV
            // objects.
            //----------------------------------------------------------
            pcFSPassD->pcAlcD = pcFSPassD->pcVecAlcD[ iter ];
            pcFSPassD->pcPEnvD = pcFSPassD->pcVecPEnvD[ iter ];
            pcFSPassD->pcLPceD = pcFSPassD->pcAlcLPceD[ iter ];

            //-------------------------------------------
            // Update the dynamic LPCE object:
            //     Piece critical buckling limits
            //     Piece elastic modulus
            //     Differential strain relief coefficient
            //-------------------------------------------
            line_num = __LINE__;
            pcFSPassD->pcLPceD->
                Update( pcFSPassD->pcFSStdD[ iter ]->pcExPceD->temp_avg,
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->width,
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->thick,
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->tension );

            //---------------------------------------------
            // Update the dynamic LRG object:
            //     Profile change attenuation factor
            //     Piece influence coefficient
            //     Effective per unit profile change limits
            //---------------------------------------------
            line_num = __LINE__;
            pcFSPassD->pcFSStdD[ iter ]->pcLRGD->
                Update( pcFSPassD->pcFSStdD[ iter ]->dummied,
                        pcFSPassD->pcFSStdD[ iter ]->pcEnPceD->width,
                        pcFSPassD->pcFSStdD[ iter ]->pcEnPceD->thick,
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->thick,
                        pcFSPassD->pcFSStdD[ iter ]->force_strip /
                        pcFSPassD->pcFSStdD[ iter ]->pcExPceD->width,
                        pcFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->family,
                        pcFSPassD->pcFSStdD[ iter ]->pcRollbite->DForce_DExthick(),
                        pcFSPassD->pcFSStdD[ iter ]->fs,
                        pcFSPassD->pcFSStdD[ iter ]->arcon,
                        pcFSPassD->pcLPceD );

            if ( pcFSPassD == pcLstFSPassD )
            {
                break;
            }
            else
            {
                //-------------------------------------------------
                // Increment pointer to next dynamic FSPASS object.
                //-------------------------------------------------
                pcFSPassD = ( cFSPassD* )pcFSPassD->next_obj;
            }
        }
```


## cPEnvD::Calculate()

## cAlcD::Calculate()

## a while loop for evaluation

a while loop for evaluation from from first pass to last active pass

- re-initialize lpce object 
- force_bnd will be offset by op_bnd_off
```c++
pcFSPassD->pcFSStdD[ iter ]->op_bnd_off
```
- Evaluate()
- update flt_achv

## if  redrft_perm and flatness not achv  1539 to 1740

### ef_pu_prf_sum add Pass_Mill_Targ()
a while loop from from first pass to last active pass
```
                   //-------------------------------------------------------
                    // Calculate the delivery pass effective per unit profile
                    // this pass can accomodate.
                    //-------------------------------------------------------
                    line_num = __LINE__;
                    ef_pu_prf_sum += pcTargtD->
                        Pass_Mill_Targ( iter,
                                        pcLstActFSPassD,
                                        pcFSPassD );
```
### pcTargtD->Prf()

### from bar to last pass update shape related object
like pcLPceD and pcLRGD

### cAlcD::Calculate()

### a while loop for evaluation

a while loop for evaluation from from first pass to last active pass

- re-initialize lpce object 
- force_bnd will be offset by op_bnd_off
```c++
pcFSPassD->pcFSStdD[ iter ]->op_bnd_off
```
- Evaluate()
- update flt_achv


## a while loop for pcUFDD->Log() and Xfer_Functions()  1745 to 1790

## Evaluate the delivery pass
```c++
        pcTargtD->
            Eval_Delvry_Pass( pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->tgt_profile,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->profile_tolpos,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->profile_tolneg,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->tgt_flatness,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->flatness_tolpos,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcEnPceD->pcPce->flatness_tolneg,
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcExPceD->Expansion(),
                              pcLstActFSPassD->pcFSStdD[ iter ]->pcExPceD->thick,
                              pcLstActFSPassD->pcLPceD->prf );
```

## others
```
if ( pcLstActFSPassD->pcFSStdD[ iter ]->bnd_enab )
        {
            line_num = __LINE__;
            //-------------------------------------------------------------
            // Apply the flatness vernier to the delivery pass roll bending
            // force.
            //-------------------------------------------------------------
            pcLstActFSPassD->pcFSStdD[ iter ]->force_bnd =
                pcLstActFSPassD->pcFSStdD[ iter ]->force_bnd + pcTargtD->flt_vrn;
        }
        if ( redrft_perm )
        {
            if ( !Copy_Load_Distribution (
                            iter,                       // [-] FSU [hd/bdy/tail] index
                            pcFstFSPassD,               // [-] pointer to first dynamic FSPASS
                                                        //    object
                            pcLstFSPassD,               // [-] pointer to last dynamic FSPASS
                                                        //    object
                            pcFstActFSPassD,            // [-] pointer to first non-dummied
                                                        //    dynamic FSPASS object
                            pcLstActFSPassD             // [-] pointer to last non-dummied
                                                        //    dynamic FSPASS object
                                            ) )
            {
                EMSG << "Copy_Load_Distribution() failed"
                    << END_OF_MESSAGE;
            }
        }
```
