# cAlcD::Calculate()

in alc.cpp


## some indicators

some related indicators that we have to know.
the initial values are all false.
```c++
    bool  alc_lim             ( false );                // [-] allocation limit indicator
    bool  force_pu_wid_clp    ( false );                // [-] rolling force per unit piece
                                                        //    width clamped indicator
    bool  pu_prf_same;        ( false );                // [-] target per unit profile was not
                                                        //    changed indicator
    bool  redrft_lim          ( false );                // [-] re-draft limit indicator
    bool  start_over          ( false );                // [-] start over indicator
```
## initialization
statue
```
        //------------------------------------------
        // Initialize the status indicator to valid.
        //------------------------------------------
        status = cShapeSetupD::err_valid;
```
initialize pointer to bar and last active pass.
```
        //-------------------------------------------------------------------------
        // Initialize the pointer to the dynamic FSPASS object with a zero piece
        // influence coefficient and initialize the pointer to the critical dynamic
        // FSPASS object with the pointer to the last dynamic FSPASS object.
        //-------------------------------------------------------------------------
        pcPceIZFSPassD = ( cFSPassD* )pcFstFSPassD->previous_obj;
        pcCritFSPassD = pcLstFSPassD;
```
pointer to FstFSPassD
```
const cFSPassD* pcFSPassD = pcFstFSPassD; 
```

bar alc thick related to entry piece thick of first pass.
```
        //-----------------------------------------------------------------
        // Initialize the entry piece thickness relative to the first pass.
        //-----------------------------------------------------------------
        ( ( cFSPassD* )pcFSPassD->previous_obj )->pcAlcD->thick =
            pcFstFSPassD->pcFSStdD[ iter ]->pcEnPceD->thick;
```

## calculation for pu_force_wid,thick,rollbite of every pass
from bar to last pass
if pce_infl_cof <= 0.0 then update pcPceIZFSPassD

## Calculate the minimum and maximum force change limits.
pay attention to the condition of the calculation
```
if ( redrft_perm )
        {
            //-------------------------------------------------------
            // Calculate the minimum and maximum force change limits.
            //-------------------------------------------------------
            line_num = __LINE__;
            if ( !cAlcD::Frc_Chg_Limits( iter,
                                         pcFstActFSPassD,
                                         pcLstFSPassD    ) )
            {
                status = cShapeSetupD::err_frc_sens_err;

                return;
            }
        }
```

## Calculate pu_prf_change_sum
from from first pass  to last pass

if pce_infl_cof not euqal to  0 and not dummy , calculate pu_prf_change_sum

whether strn_rlf_cof equal to 0 or not ,different calculation to pu_prf_change_sum

## pcTargtD->Delvry_Pass()

## a while loop for calculation from last pass to first pass  892 to 2029

## others related to redrft_perm



# the big while loop for heavy calcs   line 892 to 2029
3 indents


## create pointers to class objects that are part of this pass

micro optimization

```C++
 // create pointers to class objects that are part of this pass
            pcStdD    = pcFSPassD->pcFSStdD[ iter ];
            pcCRLCD   = pcStdD->pcCRLCD;
            pcAlcD    = pcFSPassD->pcAlcD;
            pcUFDD    = pcStdD->pcUFDD;
            pcLRGD    = pcStdD->pcLRGD;
            pcLPceD   = pcFSPassD->pcLPceD;
            pcPEnvD   = pcFSPassD->pcPEnvD;
            pcEnPceD  = pcStdD->pcEnPceD;
            pcExPceD  = pcStdD->pcExPceD;
            pcPrvAct = pcFSPassD->pcPrvAct; // create a pointer to the previous active pass

```


## calculate crlc  composite roll stack crown of this pass 
```
//---------------------------------------------------------------
            // Calculate the following composite roll stack crown quantities:
            //     Piece to work roll stack crown
            //     Work roll to backup roll stack crown
            //---------------------------------------------------------------
            line_num = __LINE__;
            pcCRLCD->Crns ( pcStdD->wr_shft,
                            pcStdD->angl_pc,
                            pce_wr_crn,
                            wr_br_crn );
```

**if dummied take the alc thick to previous object AND set ufd_pu_prf = 0
else: not dummied

## pcAlcD->pcRollbite->Calculate(..)

rollbite calculation

## evaluate frc_pu_wid

//----------------------------------------------------------
                    // Restrict the rolling force per unit piece width to within
                    // the rolling force per unit piece width envelope.
                    //----------------------------------------------------------
                    line_num = __LINE__;
                    cAlcD::Eval_Frc_PU_Wid( force_pu_wid_clp,
                                            pcAlcD->force_pu_wid,
                                            pcStdD->force_strip / pcStdD->pcEnPceD->width,
                                            pcPEnvD->force_pu_wid_env,
                                            pcAlcD->pcRollbite->Precision() );




## ufd_pu_prf calcs

two conditions if down stream stand influence is 0 or not
- if ( pcFSPassD->num < pcPceIZFSPassD->num )
- until ( pcFSPassD->num < pcPceIZFSPassD->num )
### if-conditon

if the downstream pass has zero strip influence coefficient
clac alc ufd_pu_prf by pcUFDD->Prf(..)
```
                if ( pcFSPassD->num < pcPceIZFSPassD->num )
                {
                    //-------------------------------------------------------------
                    // Calculate the UFD roll gap per unit profile required for the
                    // given conditions.
                    //-------------------------------------------------------------
                    line_num = __LINE__;
                    pcAlcD->ufd_pu_prf = 
                        pcUFDD->Prf ( pcAlcD->force_pu_wid,
                                      pcStdD->force_bnd,
                                      pce_wr_crn,
                                      wr_br_crn ) / 
                        pcAlcD->thick;

                    //--------------------------------------------------------
                    // Save the work roll bending force as the desired if the
                    // downstream pass has zero strip influence coefficient.
                    //--------------------------------------------------------
                    pcStdD->force_bnd_des = pcStdD->force_bnd;
                }
```
### until-condition 
until the downstream pass has zero strip influence coefficient
clac alc ufd pu prf by en&ex pu prf

then Loop through the list of mechanical actuators in the order
in which they were specified through configuration.
the loop iter max num is num_actr_typ.
determine which is primary or second mechanical actuator or determine the sequence of pc_angle, bend ,shift and so on  

in each loop calc the pc_angle, bend ,shift and so on in  pcAlcD->pcAlc->actr_prior
three systems to calc

may re_calc Re-calculate the following composite roll stack crown quantities.

FINALLY calc pcLPceD->ufd_pu_prf by 18 items


##   alc_lim     after ufd_pu_prf calcs 

```
line_num = __LINE__;
                alc_lim = fabs( pcAlcD->ufd_pu_prf - pcLPceD->ufd_pu_prf ) > pcAlcD->pcAlc->ufd_pu_prf_tol;
```


## what we can do if redrafting is permitted

first set redrft_lim = false
 if redrafting is permitted we must check that the
 pass thicknesses have not been changed as well as
 determining what force/thickness we need
        
redrft_lim = false;

if redrft_perm == true then


### calcs related to changing frc_pu_wid

                    // Changing the rolling force per unit piece width on a pass
                    // to achieve effecitve per unit profile is of no benifit if a
                    // later pass has a zero for piece influence coefficient.  In
                    // addition, the entry piece thickness relative to the first
                    // pass cannot be changed.

if ( ( pcFSPassD != pcFstFSPassD ) &&
                         !( pcFSPassD->num < pcPceIZFSPassD->num ) )

-  calcs Frc_PU_Wid_des by pcUFDD->Frc_PU_Wid(..)
 -- alc_lim = false;  line 1239

- if the force change is big enough (exceedes  the force convergence crteria)
clamp force_pu_wid_des by frcw_chg_lim to pcAlcD->force_pu_wid

- Eval_Frc_PU_Wid()

- redrft_lim = pcAlcD->force_pu_wid_des != pcAlcD->force_pu_wid;



### Determine if the rolling force per unit piece was changed.


fst pass and other pass are different

fst pass:
- pcAlcD->pcRollbite->Calculate_Exthick_Force()
- Update the dynamic LPCE object
- pcAlcD->pcRollbite->Calculate_DForce_DExthick()
- Update the dynamic LRG object

other pass:
- pcAlcD->pcRollbite->Calculate_Enthick_Force()
- pcPrvAct->pcAlcD->pcRollbite->Calculate()
- pcPrvAct->pcLPceD->Update()
- pcPrvAct->pcAlcD->pcRollbite->Calculate_DForce_DExthick()
- pcPrvAct->pcFSStdD[ iter ]->pcLRGD->Update()


## what we can do if alc ufd pu prf bias out of tol ( alc_lim)

- ufd_pu_prf
- ef_en_pu_prf_buf
- check desired effective per unit profile at the stand is outside the envelope
```
                    //-------------------------------------------------------
                    // If the desired effective per unit profile at the stand
                    // is outside the envelope
                    //-------------------------------------------------------
                    line_num = __LINE__;
                    if ( ( ef_en_pu_prf_buf > pcPrvAct->pcPEnvD->ef_pu_prf_env[ maxl ] ) ||
                         ( ef_en_pu_prf_buf < pcPrvAct->pcPEnvD->ef_pu_prf_env[ minl ] ) )
                    {
                        // The envelope is not exact since thickness may have changed
                        // so we should accept some targets outside of it.  We could also
                        // be processing a piece that cannot be rolled flat.
                        //---------------------------------------------------------
                        // if increasing pu eff profile through the mill keep entry
                        // profile below exit for this pass
                        //---------------------------------------------------------
                        if ( ef_en_pu_prf < ef_ex_pu_prf )
                        {
                            if ( ef_en_pu_prf_buf > ef_ex_pu_prf )
                            {
                                ef_en_pu_prf_buf = ef_ex_pu_prf;
                            }
                        }
                        else
                        {
                            if ( ef_en_pu_prf_buf < ef_ex_pu_prf )
                            {
                                ef_en_pu_prf_buf = ef_ex_pu_prf;
                            }
                        }
                    }
                    ef_en_pu_prf = ef_en_pu_prf_buf;
                
```
- std_ex_strn = 
                        pcLRGD->Std_Ex_Strn1

- ef_ex_pu_prf = 
                        pcLRGD->Ef_Ex_PU_Prf3(

- flt_ok

- if ( !pcAlcD->flt_ok )  accept bad flatness relative to this pas

###  Re-target the per unit profile when the following
                        // permissives are met
```
( !pcAlcD->flt_ok ) &&
( loop_count <= pcAlcD->pcAlc->loop_count_lim ) &&
( pcStdD->pcFSStd->getInstNum() <= pcCritFSPassD->pcFSStdD[ iter ]->pcFSStd->getInstNum() )
```
- ef_pu_prf_alt = pcTargtD->
                                Pass_Mill_Targ(

- std_ex_strn = pcLRGD->Std_Ex_Strn2 ()
- pu_prf = pcLRGD->Istd_Ex_PU_Prf0 ()
- pu_prf = cMathUty::Clamp()
- pcTargtD->Limit_PU_Prf()
- pcCritFSPassD = pcFSPassD;
- set start_over = true;

## after alc_lim
- pcLPceD->ufd_pu_prf = pcUFDD->Prf() / alc_thick

- pcLPceD->ef_pu_prf = pcLRGD->Ef_Ex_PU_Prf3()

-  pcLPceD->strn = pcLRGD->Std_Ex_Strn4()

- pcLPceD->prf = pcLRGD->Istd_Ex_PU_Prf0()

** not dummied over

## about start_over
Request to start over if the target per unit profile
                            // has been changed.
```
                            if ( !pu_prf_same )
                            {
                                start_over = true;
                            }
```
### if start_over true

- loop_count = loop_count + 1;
- start_over = false;
- pcFSPassD = pcLstFSPassD;
- cAlcD::Frc_Chg_Limits ()
- pcTargtD->Delvry_Pass()
- pcLstActFSPassD->pcLPceD->ef_pu_prf = ef_ex_pu_prf;

### if start_over false

- pcFSPassD = ( cFSPassD* )pcFSPassD->previous_obj;
- ef_ex_pu_prf = ef_en_pu_prf;
- ef_en_pu_prf = cMathUty::Clamp ()
- ef_pu_prf_sum = 0.0F;
- cFSPassD* pcBufFSPassD =                // [-] pointer to dynamic FSPASS
                        ( cFSPassD* )pcPceIZFSPassD->next_obj;

- a small while loop  1868 to 1989
- Calculate initial entry pu profile
- pcTargtD->Eval_Ef_En_PU_Prf()


# small while loop in start_over false calcs 1868 to 1989 

## Calculate the delta effective per unit profile change from stand entry to interstand exit
                        //------------------------------------------------------
                        // Calculate the delta effective per unit profile change
                        // from stand entry to interstand exit.
                        //------------------------------------------------------
                        line_num = __LINE__;
                        ef_pu_prf_dlt[ minl ] =
                           cMathUty::Max( pcBufFSPassD->pcFSStdD[ iter]->pcLRGD->ef_pu_prf_chg[ cb ],
                                          cMathUty::Max( ef_ex_pu_prf,
                                                         pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ minl ] ) -
                                          cMathUty::Min( ef_en_pu_prf,
                                                        ((cFSPassD*)pcBufFSPassD->previous_obj)->pcPEnvD->ef_pu_prf_env[maxl]));
                        line_num = __LINE__;
                        ef_pu_prf_dlt[ maxl ] =
                            cMathUty::Min( pcBufFSPassD->pcFSStdD[ iter]->pcLRGD->ef_pu_prf_chg[ we ],
                                           cMathUty::Min( ef_ex_pu_prf,
                                                          pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ maxl ] ) -
                                           cMathUty::Max( ef_en_pu_prf,
                                                          ((cFSPassD*)pcBufFSPassD->previous_obj)->pcPEnvD->ef_pu_prf_env[minl]));
##  ef_en_pu_prf <=> ef_ex_pu_prf 

                        if ( ef_en_pu_prf <= ef_ex_pu_prf )
                        {
                            ef_pu_prf_sum = ef_pu_prf_sum + ef_pu_prf_dlt[ maxl ];

                            if ( pcBufFSPassD == pcFSPassD )
                            {
                                if ( ef_pu_prf_sum <= 0.000001 )
                                {
                                    ef_en_pu_prf = ef_ex_pu_prf;
                                }
                                else
                                {
                                    //---------------------------------------------
                                    // Calculate effective per unit profile at the
                                    // stand entry by apportioning the summation of
                                    // delta effective per unit profile changes
                                    // from stand entry to stand space exit by
                                    // stand capability.
                                    //---------------------------------------------
                                    ef_en_pu_prf =
                                        ef_ex_pu_prf - ef_pu_prf_dlt[ maxl ] *
                                        ( ef_ex_pu_prf - ef_en_pu_prf ) /
                                        ef_pu_prf_sum;
                                }
                            }
                            else
                            {
                                if ( pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ maxl ] <= ef_en_pu_prf )
                                {
                                    ef_en_pu_prf = pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ maxl ];

                                    ef_pu_prf_sum = 0.0;
                                }
                                if ( pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ minl ] >= ef_ex_pu_prf )
                                {
                                    ef_en_pu_prf = pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ minl ];

                                    ef_pu_prf_sum = 0.0;
                                }
                            }
                        }
                        //------------------------------------------
                        // Effective per unit profile is decreasing.
                        //------------------------------------------
                        else
                        {
                            ef_pu_prf_sum = ef_pu_prf_sum + ef_pu_prf_dlt[ minl ];

                            if ( pcBufFSPassD == pcFSPassD )
                            {
                                if ( ef_pu_prf_sum >= - 0.000001 )
                                {
                                    ef_en_pu_prf = ef_ex_pu_prf;
                                }
                                else
                                {
                                    //---------------------------------------------
                                    // Calculate effective per unit profile at the
                                    // stand entry by apportioning the summation of
                                    // delta effective per unit profile changes
                                    // from stand entry to stand space exit by
                                    // stand capability.
                                    //---------------------------------------------
                                    ef_en_pu_prf =
                                        ef_ex_pu_prf - ef_pu_prf_dlt[ minl ] *
                                        ( ef_ex_pu_prf - ef_en_pu_prf ) /
                                        ef_pu_prf_sum;
                                }
                            }
                            else
                            {
                                if ( pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ minl ] >= ef_en_pu_prf )
                                {
                                    ef_en_pu_prf  = pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ minl ];

                                    ef_pu_prf_sum = 0.0;
                                }

                                if ( pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ maxl ] <= ef_ex_pu_prf )
                                {
                                    ef_en_pu_prf = pcBufFSPassD->pcPEnvD->ef_pu_prf_env[ maxl ];

                                    ef_pu_prf_sum = 0.0;
                                }
                            }
                        }

